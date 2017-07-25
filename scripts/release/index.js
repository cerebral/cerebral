// import {sequence, parallel} from 'function-tree'
// import {} from 'repo-cooker'

// tree to run with `repo-cooker publish`. extra arguments could be parsed and putted in props
import { cooker } from './cooker'
import * as cook from 'repo-cooker/actions'
import releaseNotesTemplate from './releaseNotesTemplate'

cooker.run('publish', [
  cook.getLatestReleaseHash,
  cook.getHistoryFromHash,
  cook.getRawCommitsFromHistory,
  cook.parseCommits,
  cook.groupCommitsByPackage,
  cook.evaluateSemverByPackage,
  cook.relatedPackagesByPackage,
  cook.getCurrentVersionByPackage,
  cook.evaluateNewVersionByPackage,
  cook.writeVersionsToPackages,
  cook.publishUnderTemporaryNpmTag,
  cook.mapTemporaryNpmTagToLatest,
  cook.resetRepository,
  cook.tagCurrentCommit,
  cook.pushTagToRemote,
  cook.createReleaseNotes(releaseNotesTemplate),
  cook.createGithubRelease,
  cook.fireworks,
])
