let setAllChecked = function(args, state) {

  let visibleTodos = state.get('visibleTodos');

  state.set('isAllChecked', visibleTodos.filter(function(todo) {
    return !todo.completed;
  }).length === 0 && visibleTodos.length !== 0);

};

export default setAllChecked;
