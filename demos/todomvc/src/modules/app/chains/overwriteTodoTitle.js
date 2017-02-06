import {set} from 'cerebral/operators'
import {props, state} from 'cerebral/tags'
import stopEditingTodo from './stopEditingTodo'

export default [
  set(state`app.todos.${props`ref`}.title`,
    state`app.todos.${props`ref`}.$newTitle`
  ),
  ...stopEditingTodo
]
