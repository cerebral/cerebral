// tree to run with `repo-cooker publish`. extra arguments could be parsed and putted in props
import { cooker } from './cooker'
import * as cook from 'repo-cooker/actions'
import releaseNotesTemplate from './releaseNotesTemplate'

cooker.cook('publish', [
  cook.getLatestReleaseHash,
  cook.getHistoryFromHash,
  cook.getRawCommitsFromHistory,
  cook.parseCommits,
  cook.groupCommitsByPackage,
  cook.evaluateSemverByPackage,
  cook.relatedPackagesByPackage,
  // Temporary cleanup of circular deps
  // To be removed on [DEPRECATION] cleanup
  ({ props: { relatedPackagesByPackage } }) => {
    const views = ['angularjs', 'inferno', 'preact', 'react', 'vue'].map(
      k => `@cerebral/${k}`
    )
    relatedPackagesByPackage['cerebral'] = relatedPackagesByPackage[
      'cerebral'
    ].filter(key => !views.includes(key))
    return { relatedPackagesByPackage }
  },
  cook.getCurrentVersionByPackage,
  cook.evaluateNewVersionByPackage,
  cook.byBranch,
  {
    next: cook.remap(
      'newVersionByPackage',
      version => `${version}-${Date.now()}`
    ),
    otherwise: [],
  },
  cook.writeVersionsToPackages,
  cook.runNpmScript('prepublish'),
  cook.publishUnderTemporaryNpmTag,
  cook.byBranch,
  {
    master: cook.mapTemporaryNpmTagTo('latest'),
    next: cook.mapTemporaryNpmTagTo('next'),
    otherwise: [],
  },
  cook.resetRepository,
  cook.byBranch,
  {
    master: [
      cook.tagCurrentCommit,
      cook.pushTagToRemote,
      cook.createReleaseNotes(releaseNotesTemplate),
      cook.createGithubRelease,
      cook.runNpmScript('deploy'),
    ],
    otherwise: [],
  },
  cook.fireworks,
])
