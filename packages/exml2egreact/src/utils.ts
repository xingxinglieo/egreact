export const firstLowerCase = ([first, ...rest]: string) =>
  first?.toLowerCase() + rest.join("");
export const firstUpperCase = ([first, ...rest]: string) =>
  first?.toUpperCase() + rest.join("");

export const isNativeValue = (value: string) =>
  /^(((\-|\+)?\d+(\.\d+)?)|(0x(\d|[a-fA-F]){6}))$/.test(value) ||
  ["true", "false"].includes(value);

export const isReference = (value: string) =>
  value.startsWith("{") && value.endsWith("}");
