import typescript from "rollup-plugin-typescript";
import json from "@rollup/plugin-json";

export default {
  input: "./src/extension.ts",
  plugins: [json(), typescript({})],
  output: [
    {
      format: "cjs",
      file: `dist/extension.js`,
      sourcemap: true
    }
  ]
};
