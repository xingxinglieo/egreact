import { Plugin } from "../generate";

import { isNativeValue } from "../utils";

export const handleNativeValue: Plugin = {
  after({ element }) {
    // 数字或者布尔值转为表达式
    Object.keys(element.attributes).forEach((key) => {
      const value = element.attributes[key] as string;
      if (isNativeValue(value)) {
        element.attributes[key] = `{${value}}`;
      }
    });
  },
  replaceAfter(jsx) {
    return jsx.replace(/="\{((-?(\w|\.)+)|(@@[\s\S]+?))}"/g, (_, value) => {
      return `={${value.replace("@@", "")}}`;
    });
  }
};
