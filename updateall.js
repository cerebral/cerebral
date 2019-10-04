const { exec } = require('child_process')

const libs = [
  '@types/react',
  '@types/react-dom',
  '@types/uuid',
  'assert',
  'babel-cli',
  'babel-core',
  'babel-jest',
  'babel-plugin-inferno',
  'babel-plugin-transform-builtin-extend',
  'babel-plugin-transform-decorators-legacy',
  'babel-plugin-version-transform',
  'babel-preset-es2015',
  'babel-preset-preact',
  'babel-preset-react',
  'babel-preset-typescript',
  'babel-register',
  'babel-watch',
  'commitizen',
  'concurrently',
  'core-js',
  'coveralls',
  'cross-env',
  'cz-customizable',
  'cz-customizable-ghooks',
  'eslint',
  'eslint-config-prettier',
  'eslint-config-standard',
  'eslint-config-standard-jsx',
  'eslint-plugin-import',
  'eslint-plugin-node',
  'eslint-plugin-prettier',
  'eslint-plugin-promise',
  'eslint-plugin-react',
  'eslint-plugin-standard',
  'eslint-plugin-typescript',
  'execa',
  'express',
  'firebase-server',
  'fs-extra',
  'gh-pages',
  'husky',
  'inferno',
  'inferno-create-element',
  'inferno-shared',
  'istanbul-combine',
  'jest',
  'jsdom',
  'lint-staged',
  'marksy',
  'mocha',
  'mock-socket',
  'node-sass',
  'npm-run-all',
  'nyc',
  'parcel-bundler',
  'parcel-plugin-typescript',
  'preact',
  'prettier',
  'prismjs',
  'prop-types',
  'raf',
  'react-scripts',
  'react-scripts-ts',
  'react-test-renderer',
  'shx',
  'string-template',
  'symlink-dir',
  'ts-jest',
  'ts-node',
  'tslint-config-prettier',
  'typescript',
  'typescript-definition-tester',
  'typescript-eslint-parser',
  'vue',
  'xhr-mock',
  'yargs',
  'zone.js',
]

libs.reduce((aggr, lib) => {
  return aggr.then(() => {
    return new Promise((resolve, reject) => {
      exec('npm install ' + lib + '@latest --save-dev', (err) => {
        if (err) {
          reject(err)
        } else {
          console.log('Installed ' + lib)
          resolve()
        }
      })
    })
  })
}, Promise.resolve())
