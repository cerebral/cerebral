import {set} from 'cerebral/operators'
import {input, state} from 'cerebral/tags'
import stopEditingTodo from './stopEditingTodo'

export default [
  set(state`app.todos.${input`ref`}.title`,
    state`app.todos.${input`ref`}.$newTitle`
  ),
  ...stopEditingTodo
]
