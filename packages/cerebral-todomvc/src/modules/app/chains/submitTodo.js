import {set, state} from 'cerebral/operators'

import createTodo from '../actions/createTodo'
import postTodo from '../actions/postTodo'
import updateTodo from '../actions/updateTodo'
import markTodoFailed from '../actions/markTodoFailed'

export default [
  createTodo,
  set(state`app.newTodoTitle`, ''),
  set(state`app.isSaving`, true),
  postTodo, {
    success: [updateTodo],
    error: [markTodoFailed]
  },
  set(state`app.isSaving`, false)
]
