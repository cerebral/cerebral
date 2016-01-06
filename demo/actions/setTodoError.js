function setTodoError ({input, state}) {

  var path = ['todos', input.ref];

  let todo = state.get(path);

  state.merge(path, {
    id: args.id,
    $isSaving: false,
    $error: input.error
  });

};

export default setTodoError;
