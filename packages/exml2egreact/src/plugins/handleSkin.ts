import { Plugin } from "../generate";

export const handleSkin = {
  replaceBefore(exml, info) {
    info.className =
      exml.match(/class="skins\.([a-zA-Z]+)"/)?.[1] ?? "SkinName";
    return exml;
  },
  before({ element }) {
    if (element.elements?.[0]?.name === "e:Skin") {
      delete element.declaration;
      element.elements = element.elements[0].elements;
    }
  }
};
