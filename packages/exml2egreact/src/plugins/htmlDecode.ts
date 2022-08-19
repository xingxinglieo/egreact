import { Plugin } from "../generate";

export const htmlDecode: Plugin = {
  replaceAfter(jsx) {
    return jsx
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, `"`)
      .replace(/&apos;/g, `'`)
      .replace(/&lt;/g, `<`)
      .replace(/&gt;/g, `>`);
  }
};
