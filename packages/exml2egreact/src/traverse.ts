import { Element } from "xml-js";
import { get } from "lodash";

type Props<T = any> = {
  element: Element;
  elements: Element[];
  origin: Element;
  root: Element;
  info: T;
  source: string;
  path: string[];
  plugins: Plugin<T>[];
};

export type TraverseFunction = (
  args: Props & {
    stop: () => void;
    findAncestor: (level: number) => Element;
  }
) => void;

export type Plugin<T = any> = {
  replaceBefore?: (exml: string, info: T) => string;
  replaceAfter?: (jsx: string, info: T) => string;
  after?: TraverseFunction;
  before?: TraverseFunction;
};

const findAncestor = (root: Element, target: Element, level: number) => {
  const path: Element[] = [];
  const traverse = (element: Element, target: Element) => {
    path.push(element);
    if (element === target) {
      return true;
    } else if ("elements" in element) {
      for (const e of element.elements) {
        if (traverse(e, target)) {
          return true;
        }
      }
    }
    path.pop();
    return false;
  };
  traverse(root, target);
  return path[path.length - 1 - level];
};

export const traverse = (args: Props) => {
  const { root, element, path, plugins } = args;

  element.attributes = element.attributes ?? {};

  for (const p of plugins) {
    let count = 0;
    const stop = () => count++;
    p.before?.({
      ...args,
      stop,
      findAncestor: (level: number) => findAncestor(root, element, level)
    });
    if (count > 0) {
      return;
    }
  }

  // 递归
  if ("elements" in element) {
    let needTraverseArr = element.elements;
    while (needTraverseArr.length) {
      const oldElement = element.elements;
      const copy = [...oldElement];
      element.elements = copy;

      for (let i = 0; i < needTraverseArr.length; i++) {
        const index = copy.indexOf(needTraverseArr[i]);
        if (index > -1) {
          traverse({
            ...args,
            element: needTraverseArr[i],
            elements: copy,
            path: [...path, "elements", String(index)]
          });
        }
      }

      needTraverseArr = copy.filter((e) => oldElement.indexOf(e) === -1);
    }
  }

  for (const p of plugins) {
    let count = 0;
    const stop = () => count++;
    p.after?.({
      ...args,
      stop,
      findAncestor: (level: number) => findAncestor(root, element, level)
    });
    if (count > 0) {
      return;
    }
  }
};
