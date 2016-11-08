import {input, set, state} from 'cerebral/operators'

export default [
  set(state`projects.$draft.${input`field`}`, input`value`)
]
