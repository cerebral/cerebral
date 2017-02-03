import {merge, set} from 'cerebral/operators'
import {props, state} from 'cerebral/tags'

import createTodo from '../actions/createTodo'
import postTodo from '../actions/postTodo'

export default [
  createTodo,
  set(state`app.newTodoTitle`, ''),
  set(state`app.isSaving`, true),
  postTodo, {
    success: [
      merge(state`app.todos.${props`ref`}`, {
        id: props`id`,
        $isSaving: false
      })
    ],
    error: [
      merge(state`app.todos.${props`ref`}`, {
        $isSaving: false,
        $error: props`error`
      })
    ]
  },
  set(state`app.isSaving`, false)
]
