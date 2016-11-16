import {input, set, state} from 'cerebral/operators'
import validateField from '../factories/validateField'

export default [
  set(state`${input`field`}.value`, input`value`),
  validateField(input`field`)
]
