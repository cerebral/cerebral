let toggleTodoCompleted = function(cerebral, id) {
  let ref = cerebral.ref.get(id);
  let todo = cerebral.get(['todos', ref]);
  cerebral.set([todo, 'completed'], !todo.completed);
};

export default toggleTodoCompleted;