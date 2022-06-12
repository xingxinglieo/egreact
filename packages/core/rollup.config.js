import typescript from 'rollup-plugin-typescript'
import replace from '@rollup/plugin-replace'
import { terser } from 'rollup-plugin-terser'

const env = process.env.NODE_ENV
const isProduction = env === 'production'
const configs = {
  input: './src/index.ts',
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify(env),
      preventAssignment: true
    }),
    typescript({}),
    ...(isProduction
      ? [
          terser({
            compress: {
              pure_getters: true,
              unsafe: true,
              unsafe_comps: true,
            },
          }),
        ]
      : []),
  ],
  output: [
    {
      format: 'cjs',
      file: `dist/index.cjs${isProduction ? '.min' : ''}.js`,
      sourcemap: !isProduction,
    },
    {
      format: 'es',
      file: `dist/index.esm${isProduction ? '.min' : ''}.js`,
      sourcemap: !isProduction,
    },
  ],
}

export default configs
