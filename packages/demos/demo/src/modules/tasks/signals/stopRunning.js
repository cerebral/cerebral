import { set, unset } from 'cerebral/operators'
import { props, state } from 'cerebral/tags'
import save from '../../../common/Collection/signals/save'
import makeRef from '../../../common/Collection/actions/makeRef'
import paths from '../../../common/Collection/paths'

import elapsedSeconds from '../compute/elapsedSeconds'
import now from '../compute/now'

const moduleName = 'tasks'
const { collectionPath, draftPath, errorPath } = paths(moduleName)

export default [
  // Avoid list flicker
  unset(state`${collectionPath}.running`),

  // Prepare new task to be saved
  set(props`value`, state`${draftPath}`),
  set(props`now`, now),
  set(props`value.endedAt`, props`now`),
  unset(state`tasks.$now`),
  set(
    props`value.elapsed`,
    elapsedSeconds(props`value.startedAt`, props`value.endedAt`)
  ),
  // FIXME: same here...
  makeRef,
  set(props`key`, props`ref`),
  ...save(moduleName),
  {
    success: [
      // Saved new task, now update 'running'
      set(state`${draftPath}.key`, 'running'),
      unset(state`${draftPath}.startedAt`),
      unset(state`${draftPath}.endedAt`),
      unset(state`${draftPath}.elapsed`),
      set(props`value`, state`${draftPath}`),
      set(props`key`, 'running'),
      ...save(moduleName),
      {
        success: [],
        error: [set(state`${errorPath}`, props`error`)],
      },
    ],
    error: [set(state`${errorPath}`, props`error`)],
  },
]
