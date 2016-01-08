function setVisibleTodos ({state, module, modules}) {

  let todos = module.state.get(['todos']);
  let filter = modules.app.footer.state.get(['filter']);
  let visibleTodosRefs = Object.keys(todos).filter(function(key) {

    let todo = todos[key];
    return (
      filter === 'all' ||
      (filter === 'completed' && todo.completed) ||
      (filter === 'active' && !todo.completed)
    );

  });
  module.state.set(['visibleTodosRefs'], visibleTodosRefs);

};

export default setVisibleTodos;
