import { ts, Project, ScriptKind, SyntaxKind } from 'ts-morph'
import { CollectInfo } from './index'

const generateTemplate = (exml, info: CollectInfo) => {
  const { className, ids, skins } = info

  const refsIdentifiers = ids.map(([id, type]) => `const ${id}Ref = useRef<${type}>();`).join('\n')
  const skinsIdentifiers = skins.map(([id, skin]) => `const [${id}] = useState(() => new ${skin}());`).join('\n')
  const refsEffects = ids.map(([id]) => `context.${id} = ${id}Ref.current;`).join('\n')
  const skinsEffects = skins.map(([id]) => `context.${id} = ${id};`).join('\n')

  const jsx = exml.replace(/="{(-?(\w|\.)+)}"/g, (_, value) => {
    // const variableWhiteList = ['eui', 'egret']
    // let s = ''
    // const firstKey = value.split('.')[0]
    // if (/^(\-|\+)?\d+(\.\d+)?$/.test(value) || ['true', 'false'].includes(value)) {
    //   s = value
    // } else if (firstKey in global || variableWhiteList.includes(firstKey)) {
    //   s = value
    // }
    return `={${value}}`
  })

  return `
import React, { useRef, useState, useEffect } from 'react';
export const ${className} = ({ context }) => {
  const { data, currentState } = context;

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
}`
}
const project = new Project()

export const generate = (exml: string, info: CollectInfo) => {
  const s = generateTemplate(exml, info)
  const { className } = info
  project
    .createSourceFile(className + '.tsx', s, {
      overwrite: true,
      scriptKind: ScriptKind.TSX,
    })
    .saveSync()
}
