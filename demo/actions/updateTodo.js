let updateTodo = function(cerebral, updatedTodo) {
  let todo = cerebral.getByRef('todos', updatedTodo.ref);
  cerebral.merge(todo, updatedTodo);
};

export default updateTodo;