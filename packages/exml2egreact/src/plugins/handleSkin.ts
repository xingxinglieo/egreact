import { Plugin } from "../generate";

export const handleSkin: Plugin = {
  replaceBefore(exml, info) {
    info.className =
      exml.match(/class="skins\.([a-zA-Z]+)"/)?.[1] ?? "SkinName";
    return exml;
  },
  before({ element }) {
    const child = element.elements?.[0];
    if (
      child !== undefined &&
      child.name === "e:Skin" &&
      child.attributes &&
      "class" in child.attributes
    ) {
      delete element.declaration;
      element.elements = element.elements[0].elements;
    }
  }
};
