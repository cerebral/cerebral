import {input, merge, set, state} from 'cerebral/operators'

import createTodo from '../actions/createTodo'
import postTodo from '../actions/postTodo'

export default [
  createTodo,
  set(state`app.newTodoTitle`, ''),
  set(state`app.isSaving`, true),
  postTodo, {
    success: [
      merge(state`app.todos.${input`ref`}`, {
        id: input`id`,
        $isSaving: false
      })
    ],
    error: [
      merge(state`app.todos.${input`ref`}`, {
        $isSaving: false,
        $error: input`error`
      })
    ]
  },
  set(state`app.isSaving`, false)
]
