import {set, unset} from 'cerebral/operators'
import {props, state} from 'cerebral/tags'
import setNow from '../actions/setNow'
import paths from '../../../common/Collection/paths'
import save from '../../../common/Collection/signals/save'
import updateNow from './updateNow'

const moduleName = 'tasks'
const {draftPath, errorPath} = paths(moduleName)

export default [
  setNow,
  set(state`tasks.$now`, props`now`),
  set(state`${draftPath}.key`, 'running'),
  set(state`${draftPath}.startedAt`, state`tasks.$now`),
  unset(state`${draftPath}.endedAt`),
  unset(state`${draftPath}.elapsed`),

  set(props`value`, state`${draftPath}`),
  set(props`key`, 'running'),

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
