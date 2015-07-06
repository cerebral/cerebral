let setVisibleTodos = (cerebral, value) => {
  
  let todos = cerebral.get('todos');
  let filter = cerebral.get('filter');
  let visibleTodos = Object.keys(todos).filter((key) => {

    let todo = todos[key];
    
    return (
      filter === 'all' ||
      (filter === 'completed' && todo.completed) ||
      (filter === 'active' && !todo.completed)
    );

  });
  
  cerebral.set('visibleTodos', visibleTodos);

  return value;
};

export default setVisibleTodos;
