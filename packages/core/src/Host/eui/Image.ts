import bitmap from '../egret/Bitmap'
import { NormalProp, euiBaseLayoutProp, EventProp } from '../common'
const image = {
  ...bitmap,
  ...euiBaseLayoutProp,
  __Class: eui.Image,
  source: NormalProp.passWithType<string | egret.Texture>(),
  onComplete: EventProp.eventSetter,
}
export default image
