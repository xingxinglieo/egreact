import { Plugin } from "../generate";
import { Element } from "xml-js";

const propTagHandlers: {
  [key: string]: (parent: Element, self: Element) => void;
} = {
  layout: (parent, self) => {
    parent.attributes = {
      ...parent.attributes,
      layout: self.elements
        .find((e) => e.type === "element")
        .name.replace("e:", "")
        .replace("Layout", "")
        .toLocaleLowerCase(),
      ...Object.keys(self.elements.find((e) => e.type === "element")).reduce(
        (obj, key) => {
          obj["layout-" + key] = obj[key];
          return obj;
        },
        {}
      )
    };
  }
};

export const handlePropTag: Plugin = {
  before({ element, elements, stop, findAncestor }) {
    if ("name" in element && /^e:[a-z]\w*$/.test(element.name)) {
      const parent = findAncestor(1);
      const prop = element.name.replace("e:", "");
      if (propTagHandlers[prop]) {
        const i = elements.indexOf(element);
        elements.splice(i, 1);
        propTagHandlers[prop](parent, element);
        return stop();
      }
    }
  }
};
