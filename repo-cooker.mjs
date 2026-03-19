import { Cooker } from 'repo-cooker'

const dryRun = process.argv.includes('--dry-run')

export const cooker = Cooker(process.argv, {
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
