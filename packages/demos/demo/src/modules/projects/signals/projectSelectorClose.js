import {set} from 'cerebral/operators'
import {state} from 'cerebral/tags'

export default [
  set(state`projects.$showProjectSelector`, false),
  set(state`projects.$filter`, '')
]
