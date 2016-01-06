function setVisibleTodos ({state, module}) {

  let todos = state.get([module, 'todos']);
  let filter = state.get(['footer', 'filter']);
  let visibleTodosRefs = Object.keys(todos).filter(function(key) {

    let todo = todos[key];
    return (
      filter === 'all' ||
      (filter === 'completed' && todo.completed) ||
      (filter === 'active' && !todo.completed)
    );

  });
  state.set([module, 'visibleTodosRefs'], visibleTodosRefs);

};

export default setVisibleTodos;
