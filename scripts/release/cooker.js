import { Cooker } from 'repo-cooker'

const dryRun = process.argv[2] !== '--publish'

process.env.REPO_COOKER_GITHUB_TOKEN = process.env.GH_TOKEN

export const cooker = Cooker({
  devtools: dryRun
    ? {
        host: 'localhost:8787',
      }
    : null,
  path: '.',
  packagesGlobs: [
    'packages/node_modules/*',
    'packages/node_modules/@cerebral/*',
    '!packages/node_modules/@cerebral',
  ],
  dryRun,
})
