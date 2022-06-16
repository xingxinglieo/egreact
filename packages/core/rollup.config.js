import typescript from 'rollup-plugin-typescript'
import json from '@rollup/plugin-json'

const configs = {
  input: './src/index.ts',
  plugins: [json(), typescript({})],
  output: [
    {
      format: 'cjs',
      file: `dist/index.cjs.js`,
    },
    {
      format: 'es',
      file: `dist/index.esm.js`,
    },
  ],
}

export default configs
