import { Instance, PropSetterParameters } from '../../type'
import label from '../eui/Label'
// import { proxyHelper } from '../utils'
// import font from './Font'
export class Anchor extends eui.Label {
  // __textFlow: [egret.ITextElement] = [
  //   {
  //     text: '',
  //     style: {
  //       target: '_self',
  //     },
  //   },
  // ]
  // constructor() {
  // super()
  // this.reAttach()
  // }
  // reAttach() {
  // this.textFlow = [this.__textFlow[0]]
  // }
}
// ...font,
const aTag = {
  ...label,
  __Class: eui.Label,
  // __Class: Anchor,
  // __Class: proxyHelper({
  //   constructor: Anchor,
  //   configs: {
  //     set(target, p, value) {
  //       // 优先设置原实例
  //       if (p === 'text') {
  //         target.__textFlow[0].text = value
  //       } else if (p in target || p === '__renderInfo') {
  //         target[p] = value
  //       } else {
  //         // 否则设置内置实例
  //         target.__textFlow[0].style[p] = value
  //       }
  //       target.reAttach()
  //       return true
  //     },
  //     get(target, p) {
  //       if (p === 'text') return target.__textFlow[0].text
  //       else if (p in target || p === '__renderInfo') return target[p]
  //       else return target.__textFlow[0].style[p]
  //     },
  //   },
  // }),
  href: () => void 0,
  onClick: ({
    newValue,
    instance,
  }: PropSetterParameters<Function, Instance<egret.DisplayObject>>) => {
    const value = (e) => {
      e.button = 0 // 据 react-router 源码
      newValue(e)
    }
    instance.addEventListener(egret.TouchEvent.TOUCH_TAP, value, instance)
    instance.touchEnabled = true
    return () => {
      instance.removeEventListener(egret.TouchEvent.TOUCH_TAP, value, instance)
    }
  },
}
export default aTag
