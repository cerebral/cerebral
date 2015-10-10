function setAllChecked (args, state) {

  let visibleTodosRefs = state.get(['visibleTodosRefs']);

  state.set('isAllChecked', visibleTodosRefs.filter(function(todo) {
    return !todo.completed;
  }).length === 0 && visibleTodosRefs.length !== 0);

};

export default setAllChecked;
