import Devtools from 'function-tree/devtools'
import { Cooker } from 'repo-cooker'

const dryRun = process.argv[2] !== '--publish'

process.env.REPO_COOKER_GITHUB_TOKEN = process.env.GH_TOKEN

export const cooker = Cooker({
  devtools:
    !process.env.CI &&
      new Devtools({
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
