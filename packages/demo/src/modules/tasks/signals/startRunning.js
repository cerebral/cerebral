import {input, set, state, unset} from 'cerebral/operators'
import now from '../operators/now'
import paths from '../../../common/Collection/paths'
import save from '../../../common/Collection/signals/save'
import updateNow from './updateNow'

const moduleName = 'tasks'
const {draftPath, errorPath} = paths(moduleName)

export default [
  set(state`tasks.$now`, now),
  // FIXME: set key = 'running' in draft
  set(state`${draftPath}.key`, 'running'),
  set(state`${draftPath}.startedAt`, state`tasks.$now`),
  unset(state`${draftPath}.endedAt`),
  unset(state`${draftPath}.elapsed`),

  set(input`value`, state`${draftPath}`),
  set(input`key`, 'running'),

  // Save as running task in collection
  ...save(moduleName), {
    success: [
      // Start running
      ...updateNow
    ],
    error: [
      set(state`${errorPath}`)
    ]
  }
]
