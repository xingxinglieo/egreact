import bitmap from '../egret/Bitmap'
import { NormalProp, euiBaseLayoutProp, EventProp } from '../common'
const image = {
  ...bitmap,
  ...euiBaseLayoutProp,
  __Class: eui.Image,
  source: NormalProp.pass<string | egret.Texture | void>,
  onComplete: EventProp.eventSetter,
}
export default image
