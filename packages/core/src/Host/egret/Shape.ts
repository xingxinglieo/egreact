import displayObjectPropsHandlers from "./DisplayObject";
import { graphicsProp } from "../common";
import { mixinHelper } from "../utils";
const shapePropsHandlers = mixinHelper
  .set({
    ...displayObjectPropsHandlers,
    __Class: egret.Sprite
  })
  .mixin(graphicsProp, "graphics")
  .get();
export default shapePropsHandlers;
