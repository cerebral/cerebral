import {input, set, state} from 'cerebral/operators'

export default [
  set(state`${input`field`}`, input`value`)
]
