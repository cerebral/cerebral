import {input, set, state} from 'cerebral/operators'

export default [
  set(state`projects.$draft`, state`projects.all.${input`ref`}`)
]
