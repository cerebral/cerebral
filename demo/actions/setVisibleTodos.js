let setVisibleTodos = function(cerebral, value) {
  
  let todos = cerebral.get('todos');
  let filter = cerebral.get('filter');
  let visibleTodos = todos.filter(function(todo) {
    return (
      filter === 'all' ||
      (filter === 'completed' && todo.completed) ||
      (filter === 'active' && !todo.completed)
    );
  })
  .map(function (todo) {
    return todo.ref;
  });
  cerebral.set('visibleTodos', visibleTodos);

  return value;
};

export default setVisibleTodos;
