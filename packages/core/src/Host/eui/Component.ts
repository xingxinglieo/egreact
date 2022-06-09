import displayObjectContainerPropsHandlers from '../egret/DisplayObjectContainer'
import { NormalProp, euiBaseLayoutProp, EventProp } from '../common'
const componentHandlers = {
  ...displayObjectContainerPropsHandlers,
  ...euiBaseLayoutProp,
  __Class: eui.Component,
  skinName: NormalProp.passWithType<any>(),
  currentState: NormalProp.str,
  hostComponentKey: NormalProp.str,
  enabled: NormalProp.boo,
  skin: NormalProp.passWithType<eui.Skin>(),
  onComplete: EventProp.eventSetter,
}
export default componentHandlers
