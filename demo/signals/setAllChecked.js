let setAllChecked = function(store) {
  var visibleTodos = store.get('visibleTodos');
  store.set('isAllChecked', visibleTodos.filter(function(todo) {
    return !todo.completed;
  }).length === 0 && visibleTodos.length !== 0);
};

export default setAllChecked;
