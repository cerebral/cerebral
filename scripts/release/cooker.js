import Devtools from 'function-tree/devtools'
import { Cooker } from 'repo-cooker'

const dryRun = process.argv[2] !== '--publish'

export const cooker = Cooker({
  devtools: new Devtools({
    host: 'localhost:8787',
  }),
  path: '.',
  packagesGlobs: [
    'packages/node_modules/*',
    'packages/node_modules/@cerebral/*',
    '!packages/node_modules/@cerebral',
  ],
  dryRun,
})
