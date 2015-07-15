let addTodo = function(args, state) {

  var ref = state.get('nextRef');
  let todo = {
    $ref: ref,
    $isSaving: true,
    title: state.get('newTodoTitle'),
    completed: false
  };

  state.set(['todos', ref], todo);
  state.set('newTodoTitle', '');
  state.set('nextRef', ref + 1);

  return {
    ref: ref
  };
};

export default addTodo;
