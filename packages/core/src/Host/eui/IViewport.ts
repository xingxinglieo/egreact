import uiComponentHandlers from "./UIComponent";
import { NormalProp } from "../common";

const iViewport = {
  ...uiComponentHandlers,
  contentHeight: NormalProp.num,
  contentWidth: NormalProp.num,
  scrollEnabled: NormalProp.boo,
  scrollH: NormalProp.num,
  scrollV: NormalProp.num
};
export default iViewport;
