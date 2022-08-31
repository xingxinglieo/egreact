import { Plugin } from "../generate";

import { isNativeValue, isReference } from "../utils";

const translateExpression = (value: string) =>
  isNativeValue(value)
    ? value
    : isReference(value)
    ? value.replace("{", "").replace("}", "")
    : `'${value}'`;

export const handleConditionProps: Plugin = {
  after({ element, path, stop }) {
    // 处理类似 y.state 的属性
    const conditionProps: {
      [key: string]: [string | undefined, [string, string][]]; // [defaultValue,[key, value][]]
    } = {};
    Object.entries(element.attributes).forEach(([key, value]) => {
      const keys = key.split(".");

      if (!conditionProps[keys[0]]) {
        conditionProps[keys[0]] = [undefined, []];
      }
      const store = conditionProps[keys[0]];
      if (keys.length > 1) {
        store[1].push([keys[1], value as string]);
        delete element.attributes[key];
      } else {
        store[0] = value as string;
      }
    });

    Object.entries(conditionProps).forEach(([key, value]) => {
      if (value[1].length) {
        element.attributes[key] = `{@@({${value[1].reduce((s, [key, value]) => {
          s = s + `'${key}':${translateExpression(value)},`;
          return s;
        }, "")}})[currentState] ?? ${
          value[0] !== undefined ? translateExpression(value[0]) : "null"
        }}`;
      }
    });
  }
};
