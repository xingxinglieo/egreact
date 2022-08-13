import typescript from 'rollup-plugin-typescript'
import json from '@rollup/plugin-json'

export default {
  input: './src/index.ts',
  plugins: [json(), typescript({})],
  output: [
    {
      format: 'es',
      file: `dist/index.esm.js`,
      sourceMap: false,
    },
  ],
}
