import displayObjectPropsHandlers from "../egret/DisplayObject";
import { euiBaseLayoutProp } from "../common";
const uiComponentHandlers = {
  ...displayObjectPropsHandlers,
  ...euiBaseLayoutProp
};
export default uiComponentHandlers;
