import { Plugin } from "../generate";

export const handleVariable = {
  replaceBefore(exml, info) {
    const v = exml
      .match(/\{[a-zA-Z_]+\w+(\.[a-zA-Z_]+\w+)*}/g)
      ?.map((s) => s.replace("{", "").replace("}", "").split(".")[0]) ?? [
      "currentState"
    ];
    v.push("currentState");
    info.variables = [...new Set(v)];

    return exml;
  }
};
