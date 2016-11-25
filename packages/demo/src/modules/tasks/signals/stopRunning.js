import {input, set, state, unset} from 'cerebral/operators'
import create from '../../../common/Collection/signals/create'
import makeRef from '../../../common/Collection/operators/makeRef'
import paths from '../../../common/Collection/paths'

import elapsedSeconds from '../operators/elapsedSeconds'
import now from '../operators/now'

export default function (moduleName) {
  const {draftPath} = paths(moduleName)
  return [
    set(input`value`, state`${draftPath}`),
    set(input`value.endedAt`, now),
    set(input`value.elapsed`,
      elapsedSeconds(input`value.startedAt`, input`value.endedAt`)
    ),
    set(input`key`, makeRef),
    unset(state`${draftPath}.startedAt`),
    unset(state`${draftPath}.endedAt`),
    ...create(moduleName)
  ]
}
