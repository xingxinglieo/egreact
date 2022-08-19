import { Plugin } from "../generate";


export const handleSpecialProps: Plugin = {
  after({ element, elements }) {
    // 处理 includeIn 属性
    if ("includeIn" in element.attributes) {
      const includeInKeys = (element.attributes.includeIn as string).split(",");
      const includeIn = includeInKeys.map((s) => `'${s}'`).join(",");
      const prefix =
        `{${
          includeInKeys.length === 1
            ? `currentState === '${includeInKeys[0]}'`
            : `[${includeIn}].includes(currentState)`
        }&&`;
      const suffix = `}`;

      const i = elements.indexOf(element);
      elements.splice(
        i,
        1,
        {
          type: "text",
          text: prefix
        },
        element,
        {
          type: "text",
          text: suffix
        }
      );

      delete element.attributes.includeIn;
    }

    // 处理 scale9Grid 语法糖
    if (
      "scale9Grid" in element.attributes &&
      !(element.attributes.scale9Grid as string).startsWith("{@@") &&
      (element.attributes.scale9Grid as string).split(",").length === 4
    ) {
      element.attributes.scale9Grid = `{@@[${element.attributes.scale9Grid}]}`;
    }
  }
};
