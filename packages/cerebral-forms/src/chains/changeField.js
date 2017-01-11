import {set} from 'cerebral/operators'
import {state, input} from 'cerebral/tags'
import validateField from '../factories/validateField'

export default [
  set(state`${input`field`}.value`, input`value`),
  validateField(state`${input`field`}`)
]
