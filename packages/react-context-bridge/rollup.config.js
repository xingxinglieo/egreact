import typescript from "rollup-plugin-typescript";

export default {
  input: "./src/index.tsx",
  plugins: [typescript({})],
  output: [
    {
      format: "es",
      file: `dist/index.esm.js`,
      sourcemap: false
    },
    {
      format: "cjs",
      file: `dist/index.cjs.js`,
      sourcemap: false
    }
  ]
};
