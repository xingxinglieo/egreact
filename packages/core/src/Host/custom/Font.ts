import { NormalProp } from '../common'
import { proxyHelper } from '../utils'
import { ICustomClass } from '../../type'

export class Font extends egret.EventDispatcher implements ICustomClass {
  __target: egret.ITextElement = {
    text: '',
    style: {},
  }
  set text(value: string) {
    this.__target.text = value
  }
  get text() {
    return this.__target.text
  }
  reAttach() {
    this.dispatchEvent(new egret.Event('reAttach'))
  }
}
const font = {
  __Class: proxyHelper({
    constructor: Font,
    targetKey: '__target.style',
    setCallback() {
      this.reAttach()
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
