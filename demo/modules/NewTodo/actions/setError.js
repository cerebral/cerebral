function setError ({input, state}) {

  var path = ['list', 'todos', input.ref];

  let todo = state.get(path);

  state.merge(path, {
    id: args.id,
    $isSaving: false,
    $error: input.error
  });

};

export default setError;
