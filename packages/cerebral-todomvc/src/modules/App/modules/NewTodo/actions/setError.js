function setError ({input, state, modules}) {

  var path = ['todos', input.ref];

  let todo = modules.app.list.state.get(path);

  modules.app.list.state.merge(path, {
    id: args.id,
    $isSaving: false,
    $error: input.error
  });

};

export default setError;
