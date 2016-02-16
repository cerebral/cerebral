function clearCompleted ({state}) {

  let todos = state.get('app.list.todos');

  Object.keys(todos).forEach(function (key) {
    if (todos[key].completed && !todos[key].$isSaving) {
      state.unset(`app.list.todos.${key}`);
    }
  });

};

export default clearCompleted;
