import displayObjectPropsHandlers from './DisplayObject'
import { NormalProp } from '../common'

const bitmapTextHandlers = {
  ...displayObjectPropsHandlers,
  __Class: egret.BitmapText,
  font: NormalProp.pass<egret.BitmapFont | void>,
  letterSpacing: NormalProp.num,
  lineSpacing: NormalProp.num,
  smoothing: NormalProp.boo,
  text: NormalProp.str,
  textAlign: NormalProp.str,
  verticalAlign: NormalProp.str,
}
export default bitmapTextHandlers
