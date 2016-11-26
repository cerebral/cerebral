import {input, set, state, unset} from 'cerebral/operators'
import save from '../../../common/Collection/signals/save'
import makeRef from '../../../common/Collection/operators/makeRef'
import paths from '../../../common/Collection/paths'

import elapsedSeconds from '../operators/elapsedSeconds'
import now from '../operators/now'

const moduleName = 'tasks'
const {collectionPath, draftPath, errorPath} = paths(moduleName)

export default [
  // Avoid list flicker
  unset(state`${collectionPath}.running`),

  // Prepare new task to be saved
  set(input`value`, state`${draftPath}`),
  set(input`value.endedAt`, now),
  unset(state`tasks.$now`),
  set(input`value.elapsed`,
    elapsedSeconds(input`value.startedAt`, input`value.endedAt`)
  ),
  set(input`key`, makeRef),
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
