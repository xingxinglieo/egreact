import { xml2js, js2xml, Element } from 'xml-js'
import {} from 'egreact'
import { get, cloneDeep } from 'lodash'
import { traverse } from './traverse'
import { generate } from './generate'

export class CollectInfo {
  className = ''
  ids: [string, string][] = [] // [id, type]
  skins: [string, string][] = [] // [id, skin]
}

export const convert = (exml: string) => {
  const info = new CollectInfo()
  const element = xml2js(exml) as Element
  const copy = cloneDeep(element)
  info.className = (copy.elements[0].attributes.class as string).replace('skins.', '')
  const root = { elements: copy.elements[0].elements } as Element
  traverse(root, info, [])
  const xml = js2xml(root)
  return generate(xml, info)
}
