import displayObjectPropsHandlers from "../egret/DisplayObject";
import { NormalProp, euiBaseLayoutProp } from "../common";
const bitmapLabel = {
  ...displayObjectPropsHandlers,
  ...euiBaseLayoutProp,
  __Class: eui.BitmapLabel,
  font: NormalProp.pass,
  letterSpacing: NormalProp.num,
  lineSpacing: NormalProp.num,
  smoothing: NormalProp.boo,
  text: NormalProp.str,
  textAlign: NormalProp.str,
  textHeight: NormalProp.num,
  textWidth: NormalProp.num,
  verticalAlign: NormalProp.str
};

export default bitmapLabel;
