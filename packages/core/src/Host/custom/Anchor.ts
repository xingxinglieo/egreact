import { Instance, PropSetterParameters } from '../../type'
import label from '../eui/Label'

export class Anchor extends eui.Label {}
const aTag = {
  ...label,
  __Class: eui.Label,
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
