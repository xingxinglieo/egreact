import { Plugin } from "../traverse";
import { CollectInfo } from "../convert";

export const handleVariable: Plugin<CollectInfo> = {
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
