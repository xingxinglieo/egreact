import displayObjectContainerPropsHandlers from "./DisplayObjectContainer";
import {  graphicsProp } from "../common";
import { mixinHelper } from "../utils";

const spritePropsHandlers = mixinHelper
  .set({
    ...displayObjectContainerPropsHandlers,
    __Class: egret.Sprite
  })
  .mixin(graphicsProp, "graphics")
  .get();
export default spritePropsHandlers;
