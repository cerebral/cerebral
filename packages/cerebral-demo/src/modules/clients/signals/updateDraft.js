import {input, set, state} from 'cerebral/operators'

export default [
  set(state`clients.$draft.${input`field`}`, input`value`)
]
