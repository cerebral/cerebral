let setVisibleTodos = function(store) {
  let todos = store.get('todos');
  let visibleTodos = todos.filter(function(todo) {
    return (
      (store.get('showCompleted') && todo.completed) ||
      (store.get('showNotCompleted') && !todo.completed)
    );
  })
  .map(function (todo) {
    return todos.indexOf(todo);
  });
  store.set('visibleTodos', visibleTodos);

};

export default setVisibleTodos;
