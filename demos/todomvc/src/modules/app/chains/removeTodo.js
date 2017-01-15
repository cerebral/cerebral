import {unset} from 'cerebral/operators'
import {input, state} from 'cerebral/tags'

export default [
  unset(state`app.todos.${input`ref`}`)
]
