let addTodo = function(store) {
  let todo = {
    ref: store.ref(),
    $isSaving: true,
    title: store.get('newTodoTitle'),
    completed: false
  };
  store.push('todos', todo);
  store.set('newTodoTitle', '');
  return todo.ref;
};

export default addTodo;