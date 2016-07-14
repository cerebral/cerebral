import add from './../actions/addTodo.js'
import save from './../actions/saveTodo.js'
import updateTodo from './../actions/updateTodo.js'
import setError from './../actions/setError.js'

export default [
  add,
  save, {
    success: [updateTodo],
    error: [setError]
  }
]
