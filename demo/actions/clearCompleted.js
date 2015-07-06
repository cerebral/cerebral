let clearCompleted = (cerebral) => {
  
  let todos = cerebral.get('todos');

  Object.keys(todos).forEach((key) => {
    if (todos[key].completed && !todos[key].$isSaving) {
      cerebral.unset('todos', key);
    }
  });
  
};

export default clearCompleted;
