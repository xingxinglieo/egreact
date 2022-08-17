import { Plugin } from "../traverse";
import { firstLowerCase, firstUpperCase } from "../utils";
import { CollectInfo } from "../convert";

const egretKeys = [
  "Bitmap",
  "BitmapText",
  "DisplayObject",
  "DisplayObjectContainer",
  "Shape",
  "Sprite",
  "TextField"
];
const euiKeys = [
  "BitmapLabel",
  "Button",
  "Component",
  "DateGroup",
  "EditableText",
  "Group",
  "Image",
  "Label",
  "List",
  "Rect",
  "Scroller",
  "UIComponent"
];

export const handleTag: Plugin<CollectInfo> = {
  before({ element, info }) {
    // 标签名转换
    if ("name" in element) {
      if (egretKeys.map((s) => "e:" + s).includes(element.name)) {
        element.name = firstLowerCase(element.name.replace("e:", ""));
      } else if (euiKeys.map((s) => "e:" + s).includes(element.name)) {
        element.name = "eui-" + firstLowerCase(element.name.replace("e:", ""));
      } else if (element.name.startsWith("ns1:")) {
        // 自定义组件
        // 1. 有 id 增入 skins 待 generate 并增加变量, 删除 id 属性避免走到后续处理
        // 2. 无 id 增加 classConstructor 属性
        const className = element.name.replace("ns1:", "");
        if ("id" in element.attributes) {
          const id = element.attributes.id as string;
          element.attributes.object = `{${id}}`;
          info.skins.push([id, className]);
          delete element.attributes.id;
        } else {
          // @ts-ignore
          element.attributes.constructor = `{${className}}`;
          info.skins.push([undefined, className]);
        }
        element.name = "primitive";
      }
    }

    // 收集 id 并加上 ref 属性
    if ("id" in element.attributes) {
      const id = element.attributes.id as string;

      const type = egretKeys
        .map((k) => firstLowerCase(k))
        .includes(element.name)
        ? "egret." + firstUpperCase(element.name)
        : euiKeys.map((k) => "eui-" + firstLowerCase(k)).includes(element.name)
        ? "eui." + firstUpperCase(element.name.split("-")[1])
        : "any";

      info.ids.push([id, type]);
      element.attributes.ref = `{${id}Ref}`;

      delete element.attributes.id;
    }
  }
};
