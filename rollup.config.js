import babel from 'rollup-plugin-babel'
import babelrc from 'babelrc-rollup'
import multiEntry from 'rollup-plugin-multi-entry'

let entry = `${process.env.entry}`
let dest = `${process.env.dest}`

export default {
  entry: entry,
  plugins: [
    babel(babelrc()),
    multiEntry()
  ],
  // external: external,
  targets: [
    {
      dest: `dist/${dest}`,
      format: 'cjs',
      moduleName: 'rollupStarterProject',
      sourceMap: true
    },
    {
      dest: `dist/es/${dest}`,
      format: 'es',
      sourceMap: true
    }
  ]
}
