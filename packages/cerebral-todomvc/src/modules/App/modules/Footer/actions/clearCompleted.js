function clearCompleted ({modules}) {

  let todos = modules.app.list.state.get(['todos']);

  Object.keys(todos).forEach(function (key) {
    if (todos[key].completed && !todos[key].$isSaving) {
      modules.app.list.state.unset(['todos', key]);
    }
  });

};

export default clearCompleted;
