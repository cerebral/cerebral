let addTodo = function(store) {
  let todo = {
    $isSaving: true,
    title: store.get('newTodoTitle'),
    completed: false
  };
  store.push('todos', todo);
  store.set('newTodoTitle', '');
  return todo;
};

export default addTodo;