import {set} from 'cerebral/operators'
import {props, state} from 'cerebral/tags'

export default [
  set(state`app.todos.${props`ref`}.$isEditing`, true)
]
