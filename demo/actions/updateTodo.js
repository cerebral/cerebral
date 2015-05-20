let updateTodo = function(cerebral, updatedTodo) {

  let todo = cerebral.get(['todos', updatedTodo.ref]);

  cerebral.ref.update(updatedTodo.ref, updatedTodo.data.id);
  
  cerebral.merge(todo, updatedTodo.data);
  cerebral.set([todo, '$isSaving'], false);
};

export default updateTodo;