let clearCompleted = function (cerebral) {

  let todos = cerebral.get('todos');

  Object.keys(todos).forEach(function (key) {
    if (todos[key].completed && !todos[key].$isSaving) {
      cerebral.unset('todos', key);
    }
  });
  
};

export default clearCompleted;