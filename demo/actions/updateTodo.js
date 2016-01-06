function updateTodo ({input, state}) {

  var path = ['todos', input.ref];

  let todo = state.get(path);

  state.merge(path, {
    id: input.id,
    $isSaving: false
  });

};

export default updateTodo;
