import {state, unset} from 'cerebral/operators'

export default [
  unset(state`projects.$draft`)
]
