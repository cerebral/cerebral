import {input, state, set, unset} from 'cerebral/operators'

export default [
  set(state`app.todos.${input`ref`}.$isEditing`, false),
  unset(state`app.todos.${input`ref`}.$newTitle`)
]
