import {set, unset} from 'cerebral/operators'
import {props, state} from 'cerebral/tags'

export default [
  set(state`app.todos.${props`ref`}.$isEditing`, false),
  unset(state`app.todos.${props`ref`}.$newTitle`)
]
