import {set, unset} from 'cerebral/operators'
import {input, state} from 'cerebral/tags'

export default [
  set(state`app.todos.${input`ref`}.$isEditing`, false),
  unset(state`app.todos.${input`ref`}.$newTitle`)
]
