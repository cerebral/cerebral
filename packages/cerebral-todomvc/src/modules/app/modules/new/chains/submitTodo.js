import addTodo from './../actions/addTodo.js'
import saveTodo from './../actions/saveTodo.js'
import updateTodo from './../actions/updateTodo.js'
import setError from './../actions/setError.js'

export default [
  addTodo,
  saveTodo, {
    success: [updateTodo],
    error: [setError]
  }
]
