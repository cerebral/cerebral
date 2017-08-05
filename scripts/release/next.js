// import {sequence, parallel} from 'function-tree'
// import {} from 'repo-cooker'

// tree to run with `repo-cooker publish`. extra arguments could be parsed and putted in props
import { cooker } from './cooker'
import * as cook from 'repo-cooker/actions'

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
  cook.remap(
    'newVersionByPackage',
    (version, props) => `${version}-${props.hash.slice(0, 6)}`
  ),
  cook.writeVersionsToPackages,
  cook.runNpmScript('prepublish'),
  cook.publishUnderTemporaryNpmTag,
  cook.mapTemporaryNpmTagTo('next'),
  cook.resetRepository,
  cook.tagCurrentCommit,
  cook.pushTagToRemote,
  cook.fireworks,
])
