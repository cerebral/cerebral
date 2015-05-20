let addTodo = function(cerebral) {

  let ref = cerebral.ref.create();
  let todo = {
    $isSaving: true,
    title: cerebral.get('newTodoTitle'),
    completed: false
  };
  
  cerebral.set(['todos', ref], todo);
  cerebral.set('newTodoTitle', '');

  return {
    ref: ref,
    data: todo
  };
};

export default addTodo;