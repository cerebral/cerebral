let updateTodo = function(cerebral, result) {

  console.log('result', result);
  let todo = cerebral.get('todos', result.ref);

  cerebral.ref.update(result.ref, result.id);
  
  cerebral.merge(todo, {
    id: result.id,
    $isSaving: false
  });
};

export default updateTodo;