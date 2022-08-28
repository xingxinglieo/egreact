import { Plugin as P } from "xml-js-convert";

export class CollectInfo {
  className = "";
  variables: string[] = [];
  ids: [string, string][] = []; // [id, type]
  skins: [string | undefined, string][] = []; // [id, skin]
}
export type Plugin = P<CollectInfo>;

export const generate = (jsx: string, info: CollectInfo) => {
  const { className, ids, skins, variables } = info;

  const variablesIdentifiers = variables.length
    ? `const { ${[...new Set(variables)].join(",")} } = context;`
    : "";
  const refsIdentifiers = ids
    .map(([id, type]) => `const ${id}Ref = useRef<${type}>(null!);`)
    .join("\n");
  const idSkins = skins.filter(([id]) => id);
  const skinsIdentifiers = idSkins
    .map(([id, skin]) => `const [${id}] = useState(() => new ${skin}());`)
    .join("\n");

  const importIdentifiers = skins.length
    ? `import { ${[...new Set(skins.map(([, skin]) => skin))].join(
        ","
      )}} from ""`
    : "";
  const refsEffects = ids
    .map(([id]) => `context.${id} = ${id}Ref.current;`)
    .join("\n");
  const skinsEffects = idSkins
    .map(([id]) => `context.${id} = ${id};`)
    .join("\n");

  return `
import React, { useRef, useState, useEffect } from 'react';
${importIdentifiers}

export default function ${className}({ context }) {
  ${variablesIdentifiers}

  ${refsIdentifiers}

  ${skinsIdentifiers}

  useEffect(() => {
    ${refsEffects}

    ${skinsEffects}
  });

  return (
    <>
      ${jsx}
    </>
  )
}`;
};
