import {input, set, state, unset} from 'cerebral/operators'
import create from '../../common/Collection/signals/create'
import elapsedSeconds from '../../common/operators/elapsedSeconds'
import now from '../../common/operators/now'
import {paths} from '../../common/Collection/paths'

export default function (moduleName) {
  const {draftPath} = paths(moduleName)
  return [
    set(input`value`, state`${draftPath}`),
    set(input`value.endedAt`, now),
    set(input`value.elapsed`,
      elapsedSeconds(input`value.startedAt`, input`value.endedAt`)
    ),
    set(input`key`, 'running'),
    unset(state`${draftPath}.startedAt`),
    ...create(moduleName)
  ]
}
