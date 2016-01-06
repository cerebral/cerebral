function clearCompleted ({state}) {

  let todos = state.get(['list', 'todos']);

  Object.keys(todos).forEach(function (key) {
    if (todos[key].completed && !todos[key].$isSaving) {
      state.unset(['list', 'todos', key]);
    }
  });

};

export default clearCompleted;
