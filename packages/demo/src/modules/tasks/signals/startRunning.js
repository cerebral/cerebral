import {input, set, state, unset} from 'cerebral/operators'
import now from '../../common/operators/now'
import {paths} from '../../common/Collection/paths'
import updateNow from './updateNow'

import create from '../../common/Collection/signals/create'

export default function (moduleName) {
  const {draftPath} = paths(moduleName)
  return [
    set(input`startedAt`, now),
    set(state`tasks.$now`, input`startedAt`),

    unset(state`${draftPath}.endedAt`),
    unset(state`${draftPath}.elapsed`),
    set(state`${draftPath}.key`, 'running'),
    set(state`${draftPath}.startedAt`, input`startedAt`),

    set(input`value`, state`${draftPath}`),
    set(input`key`, 'running'),
    ...updateNow,
    ...create(moduleName)
  ]
}
