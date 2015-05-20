let removeTodo = function(cerebral, id) {
  let ref = cerebral.ref.get(id);
  cerebral.unset('todos', ref);
  cerebral.ref.remove(id);
};

export default removeTodo;