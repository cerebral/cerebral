function clearCompleted (args, state) {

  let todos = state.get('todos');

  Object.keys(todos).forEach(function (key) {
    if (todos[key].completed && !todos[key].$isSaving) {
      state.unset('todos', key);
    }
  });

};

export default clearCompleted;
