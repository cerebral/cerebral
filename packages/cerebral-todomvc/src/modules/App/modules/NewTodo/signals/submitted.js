import add from './../actions/add.js';
import save from './../actions/save.js';
import setSaving from './../actions/setSaving.js';
import unsetSaving from './../actions/unsetSaving.js';
import updateTodo from './../actions/updateTodo.js';
import setError from './../actions/setError.js';

export default [
  add,
  setSaving,
  save, {
    success: [updateTodo],
    error: [setError]
  },
  unsetSaving
];
