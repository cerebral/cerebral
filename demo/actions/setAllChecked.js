let setAllChecked = (cerebral, value) => {

  let visibleTodos = cerebral.get('visibleTodos');

  cerebral.set('isAllChecked', visibleTodos.filter((todo) => {
    return !todo.completed;
  }).length === 0 && visibleTodos.length !== 0);

  return value;
  
};

export default setAllChecked;
