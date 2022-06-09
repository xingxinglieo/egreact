import component from "./Component";
import { NormalProp, graphicsProp } from "../common";
import { mixinHelper } from "../utils";

const rect = mixinHelper
  .set({
    ...component,
    __Class: eui.Rect,
    ellipseHeight: NormalProp.num,
    ellipseWidth: NormalProp.num,
    fillAlpha: NormalProp.num,
    fillColor: NormalProp.num,
    strokeAlpha: NormalProp.num,
    strokeColor: NormalProp.num,
    strokeWeight: NormalProp.num
  })
  .mixin(graphicsProp, "graphics")
  .get();
export default rect;
