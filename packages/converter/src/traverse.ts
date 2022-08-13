import { Element } from 'xml-js'
import { get } from 'lodash'
import { CollectInfo } from './index'

const firstLowerCase = ([first, ...rest]: string) => first?.toLowerCase() + rest.join('')
const firstUpperCase = ([first, ...rest]: string) => first?.toUpperCase() + rest.join('')

const egretKeys = ['DisplayObject', 'DisplayObjectContainer', 'Shape', 'Sprite', 'Bitmap', 'BitmapText', 'TextField']
const euiKeys = ['Component', 'Group', 'Image', 'BitmapLabel', 'Label', 'Rect', 'Scroller']

export const traverse = (copy: Element, info: CollectInfo, path: string[]) => {
  const o = get(copy, path, copy) as Element
  o.attributes = o.attributes ?? {}

  if ('name' in o) {
    if (egretKeys.map((s) => 'e:' + s).includes(o.name)) {
      o.name = firstLowerCase(o.name.replace('e:', ''))
    } else if (euiKeys.map((s) => 'e:' + s).includes(o.name)) {
      o.name = 'eui-' + firstLowerCase(o.name.replace('e:', ''))
    } else if (o.name.startsWith('ns1:')) {
      // 自定义组件
      // 1. 有 id 增入 skins 待 generate 并增加变量, 删除 id 属性避免走到后续处理
      // 2. 无 id 增加 classConstructor 属性
      const className = o.name.replace('ns1:', '')
      if ('id' in o.attributes) {
        const id = o.attributes.id as string
        o.attributes.object = `{${id}}`
        info.skins.push([id, className])
        delete o.attributes.id
      } else {
        o.attributes.classConstructor = `{${className}}`
      }
      o.name = 'primitive'
    } else if (/^e:[a-z]\w*$/.test(o.name)) {
      const parent = get(copy, path.slice(0, -2)) as Element
      const prop = o.name.replace('e:', '')
      if (handleProp[prop]) {
        parent.elements.splice(parent.elements.indexOf(o), 1)
        handleProp[prop](parent, o)
        return
      }
    }
  }

  // 收集 id 并加上 ref 属性
  if ('id' in o.attributes) {
    const id = o.attributes.id as string

    const type = egretKeys.map((k) => firstLowerCase(k)).includes(o.name)
      ? 'egret.' + firstUpperCase(o.name)
      : euiKeys.map((k) => 'eui-' + firstLowerCase(k)).includes(o.name)
      ? 'eui.' + firstUpperCase(o.name.split('-')[1])
      : 'any'

    info.ids.push([id, type])
    o.attributes.ref = `{${id}Ref}`

    delete o.attributes.id
  }

  if ('elements' in o) {
    for (let i = 0; i < o.elements.length; i++) {
      traverse(copy, info, [...path, 'elements', String(i)])
    }
  }

  if ('includeIn' in o.attributes) {
    const includeIn = (o.attributes.includeIn as string)
      .split(',')
      .map((s) => `'${s}'`)
      .join(',')
    const prefix = `{[${includeIn}].includes(currentState) ? `
    const suffix = ` : null}`

    const parent = get(copy, path.slice(0, -2),copy) as Element
    parent.elements.splice(
      parent.elements.indexOf(o),
      1,
      {
        type: 'text',
        text: prefix,
      },
      o,
      {
        type: 'text',
        text: suffix,
      },
    )

    delete o.attributes.includeIn
  }

  // 数字或者布尔值转为表达式
  Object.keys(o.attributes).forEach((key) => {
    const value = o.attributes[key] as string
    if (/^(\-|\+)?\d+(\.\d+)?$/.test(value) || ['true', 'false'].includes(value)) {
      o.attributes[key] = `{${value}}`
    }
  })
}

const handleProp: {
  [key: string]: (parent: Element, self: Element) => void
} = {
  layout: (parent, self) => {
    parent.attributes = {
      ...parent.attributes,
      layout: self.elements[0].name.replace('e:', '').replace('Layout', '').toLocaleLowerCase(),
      ...Object.keys(self.elements[0]).reduce((obj, key) => {
        obj['layout-' + key] = obj[key]
        return obj
      }, {}),
    }
  },
}
