import {set, unset} from 'cerebral/operators'
import {input, state} from 'cerebral/tags'
import save from '../../../common/Collection/signals/save'
import makeRef from '../../../common/Collection/actions/makeRef'
import paths from '../../../common/Collection/paths'

import setElapsedSeconds from '../actions/setElapsedSeconds'
import setNow from '../actions/setNow'

const moduleName = 'tasks'
const {collectionPath, draftPath, errorPath} = paths(moduleName)

export default [
  // Avoid list flicker
  unset(state`${collectionPath}.running`),

  // Prepare new task to be saved
  set(input`value`, state`${draftPath}`),
  setNow,
  set(input`value.endedAt`, input`now`),
  unset(state`tasks.$now`),
  setElapsedSeconds(input`value.startedAt`, input`value.endedAt`),
  set(input`value.elapsed`, input`elapsedSeconds`),
  makeRef,
  set(input`key`, input`ref`),
  ...save(moduleName), {
    success: [
      // Saved new task, now update 'running'
      set(state`${draftPath}.key`, 'running'),
      unset(state`${draftPath}.startedAt`),
      unset(state`${draftPath}.endedAt`),
      unset(state`${draftPath}.elapsed`),
      set(input`value`, state`${draftPath}`),
      set(input`key`, 'running'),
      ...save(moduleName), {
        success: [],
        error: [
          set(state`${errorPath}`, input`error`)
        ]
      }
    ],
    error: [
      set(state`${errorPath}`, input`error`)
    ]
  }
]
