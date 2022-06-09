import textField from "../egret/TextField";
import { NormalProp, euiBaseLayoutProp } from "../common";
const label = {
  ...textField,
  ...euiBaseLayoutProp,
  __Class: eui.Label,
  style: NormalProp.str
};
export default label;
