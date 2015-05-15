let clearCompleted = function (cerebral) {
  cerebral.set('todos', cerebral.get('todos').filter(function (todo) {
    return !todo.completed && !todo.$isSaving;
  }));
};

export default clearCompleted;