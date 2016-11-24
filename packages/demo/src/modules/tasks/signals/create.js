import {input, set, state, unset} from 'cerebral/operators'
import {set as setRemote} from 'cerebral-provider-firebase'
import makeRef from '../../common/operators/makeRef'
import now from '../../common/operators/now'
import elapsedSeconds from '../../common/operators/elapsedSeconds'
import {setPaths, paths} from '../../common/Collection/paths'

const moduleName = 'tasks'
const {errorPath} = paths(moduleName)
const runningPath = `${moduleName}.$running`
const nowPath = `${moduleName}.$now`

export default [
  // Create new
  set(input`key`, makeRef),
  // Prepare initial item state
  set(input`value`, state`${runningPath}`),
  set(input`value.endedAt`, now),
  set(input`value.elapsed`,
    elapsedSeconds(input`value.startedAt`, input`value.endedAt`)
  ),
  set(input`value.key`, input`key`),

  // Set paths with new key
  ...setPaths(moduleName),
  // Save
  setRemote(input`remoteItemPath`, input`value`), {
    success: [
      unset(state`${runningPath}.startedAt`),
      unset(state`${nowPath}`)
    ],
    error: [
      set(state`${errorPath}`)
    ]
  }
]
