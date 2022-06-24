import displayObjectContainerPropsHandlers from '../egret/DisplayObjectContainer'
import { NormalProp, euiBaseLayoutProp, EventProp } from '../common'
const componentHandlers = {
  ...displayObjectContainerPropsHandlers,
  ...euiBaseLayoutProp,
  __Class: eui.Component,
  skinName: NormalProp.pass,
  currentState: NormalProp.str,
  hostComponentKey: NormalProp.str,
  enabled: NormalProp.boo,
  skin: NormalProp.pass<eui.Skin | void>,
  onComplete: EventProp.eventSetter,
}
export default componentHandlers
