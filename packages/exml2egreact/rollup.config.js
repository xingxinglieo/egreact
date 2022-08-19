import typescript from "rollup-plugin-typescript2";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
export default {
  input: "./src/extension.ts",
  plugins: [typescript(), commonjs(), resolve(), terser()],
  output: [
    {
      format: "cjs",
      file: `dist/extension.js`,
      sourcemap: false
    }
  ]
};
