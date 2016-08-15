import {set} from 'cerebral/operators'

import createTodo from '../actions/createTodo.js'
import postTodo from '../actions/postTodo.js'
import updateTodo from '../actions/updateTodo.js'
import markTodoFailed from '../actions/markTodoFailed.js'

export default [
  createTodo,
  set('app.newTodoTitle', ''),
  set('app.isSaving', true),
  postTodo, {
    success: [updateTodo],
    error: [markTodoFailed]
  },
  set('app.isSaving', false)
]
