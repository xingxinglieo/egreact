import { NormalProp } from '../common'
import { proxyHelper } from '../utils'
import { Primitive } from './Primitive'
import { getActualInstance } from '../../utils'

export class Font implements egret.ITextElement {
  text = ''
  style = {}
}
const font = {
  __Class: proxyHelper({
    constructor: Font,
    excludeKeys: ['text'],
    targetKey: 'style',
    setCallback() {
      const parent = this.__renderInfo.parent
      const caller = parent?.__isPrimitive ? getActualInstance(parent) : parent
      parent?.reAttach?.apply(caller)
    },
  }),
  textColor: NormalProp.num,
  strokeColor: NormalProp.num,
  size: NormalProp.num,
  stroke: NormalProp.num,
  bold: NormalProp.boo,
  italic: NormalProp.boo,
  fontFamily: NormalProp.str,
  href: NormalProp.str,
  target: NormalProp.str,
  underline: NormalProp.boo,
  text: NormalProp.str,
}

export default font
