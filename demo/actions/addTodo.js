let addTodo = function(cerebral) {
  let todo = {
    $ref: cerebral.ref(),
    $isSaving: true,
    title: cerebral.get('newTodoTitle'),
    completed: false
  };
  cerebral.push('todos', todo);
  cerebral.set('newTodoTitle', '');
  return todo;
};

export default addTodo;