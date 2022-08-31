import { Plugin } from "../generate";

export const handleScroller: Plugin = {
  before({ element }) {
    if (element.name === "e:Scroller") {
      const child = element.elements.find((e) => e.type === "element");
      child.attributes.attach = "viewport";
    }
    if (element.name === "e:itemRendererSkinName") {
      // const _element = { ...element };
      element.name = "ItemRendererClass";
      const child = element.elements?.[0] ?? {};
      if (child.name === "e:Skin") {
        child.attributes = element.attributes;
        child.name = "eui-itemRenderer";
        element.elements.unshift({
          type: "text",
          text: `{data => (`
        });
        element.elements.push({
          type: "text",
          text: `)}`
        });
      }
      element.attributes = {};
    }
  }
};
