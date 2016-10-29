import {input, set, state} from 'cerebral/operators'

export default [
  set(state`app.todos.${input`ref`}.$isEditing`, true)
]
