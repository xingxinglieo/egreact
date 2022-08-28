import { Plugin } from "../generate";

export const handleScroller: Plugin = {
  before({ element }) {
    if (element.name === "e:Scroller") {
      const child = element.elements.find((e) => e.type === "element");
      child.attributes.attach = "viewport";
    }
  }
};
