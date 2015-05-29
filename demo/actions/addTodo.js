let addTodo = function(cerebral) {

  let ref = cerebral.ref.create();
  let todo = {
    $ref: ref,
    $isSaving: true,
    title: cerebral.get('newTodoTitle'),
    completed: false
  };
  
  cerebral.set(['todos', ref], todo);
  cerebral.set('newTodoTitle', '');

  return ref;
};

export default addTodo;