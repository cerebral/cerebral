let setAllChecked = function(cerebral, value) {
  let visibleTodos = cerebral.get('visibleTodos');
  cerebral.set('isAllChecked', visibleTodos.filter(function(todo) {
    return !todo.completed;
  }).length === 0 && visibleTodos.length !== 0);
  return value;
};

export default setAllChecked;
