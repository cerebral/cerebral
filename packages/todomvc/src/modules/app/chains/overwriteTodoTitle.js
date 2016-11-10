import {input, set, state} from 'cerebral/operators'
import stopEditingTodo from './stopEditingTodo'

export default [
  set(state`app.todos.${input`ref`}.title`,
    state`app.todos.${input`ref`}.$newTitle`
  ),
  ...stopEditingTodo
]
