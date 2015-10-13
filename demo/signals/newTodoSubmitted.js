import addTodo from './../actions/addTodo.js';
import saveTodo from './../actions/saveTodo.js';
import setSaving from './../actions/setSaving.js';
import unsetSaving from './../actions/unsetSaving.js';
import updateTodo from './../actions/updateTodo.js';
import setTodoError from './../actions/setTodoError.js';

export default [
  addTodo,
  setSaving,
  [
    saveTodo, {
      success: [updateTodo],
      error: [setTodoError]
    }
  ],
  unsetSaving
];
