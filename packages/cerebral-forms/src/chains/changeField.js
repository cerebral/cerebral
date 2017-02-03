import {set} from 'cerebral/operators'
import {state, props} from 'cerebral/tags'
import validateField from '../factories/validateField'

export default [
  set(state`${props`field`}.value`, props`value`),
  validateField(state`${props`field`}`)
]
