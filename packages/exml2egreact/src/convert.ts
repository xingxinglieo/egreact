import { Element } from "xml-js";
import { cloneDeep } from "lodash";
import { traverse, Plugin } from "./traverse";
import { generate } from "./generate";

const { xml2js, js2xml } = require("xml-js");

export class CollectInfo {
  className = "";
  variables: string[] = [];
  ids: [string, string][] = []; // [id, type]
  skins: [string | undefined, string][] = []; // [id, skin]
}

export const convert = (exml: string, plugins: Plugin[]) => {
  const info = new CollectInfo();
  const element = xml2js(
    plugins.reduce(
      (exml, plugin) => plugin.replaceBefore?.(exml, info) ?? exml,
      exml
    )
  ) as Element;

  const copy = cloneDeep(element);
  const root = copy;

  traverse({
    element: root,
    elements: [root],
    path: [],
    info,
    root,
    plugins,
    source: exml,
    origin: element
  });

  const jsx = js2xml(root);

  return generate(
    plugins.reduce(
      (jsx, plugin) => plugin.replaceAfter?.(jsx, info) ?? jsx,
      jsx
    ),
    info
  );
};
