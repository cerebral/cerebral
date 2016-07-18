import set from 'cerebral/operators/set'

import getNextRef from '../actions/getNextRef'
import createTodoRecord from '../actions/createTodoRecord.js'
import postTodo from '../actions/postTodo.js'
import updateTodo from '../actions/updateTodo.js'
import markTodoFailed from '../actions/markTodoFailed.js'

export default [
  getNextRef,
  createTodoRecord,
  set('app.new.title', ''),
  postTodo, {
    success: [updateTodo],
    error: [markTodoFailed]
  }
]
