function setError ({input, state}) {

  let todo = state.get(`app.list.todos.${input.ref}`);

  modules.app.list.state.merge(`app.list.todos.${input.ref}`, {
    id: args.id,
    $isSaving: false,
    $error: input.error
  });

};

export default setError;
