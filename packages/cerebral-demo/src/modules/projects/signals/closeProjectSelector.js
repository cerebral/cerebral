import {set, state} from 'cerebral/operators'

export default [
  set(state`projects.$showProjectSelector`, false),
  set(state`projects.$filter`, '')
]
