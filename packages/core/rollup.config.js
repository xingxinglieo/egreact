import typescript from 'rollup-plugin-typescript'
import sourceMaps from 'rollup-plugin-sourcemaps'
import { terser } from 'rollup-plugin-terser'
const isProduction = process.env.NODE_ENV === 'production'
const configs = {
  input: './src/index.ts',
  plugins: [
    typescript({}),
    sourceMaps(),
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
