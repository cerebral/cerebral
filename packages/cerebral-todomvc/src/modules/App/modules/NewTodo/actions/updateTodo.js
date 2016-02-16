function updateTodo ({input, state}) {

  let todo = state.get(`app.list.todos.${input.ref}`);

  state.merge(`app.list.todos.${input.ref}`, {
    id: input.id,
    $isSaving: false
  });

};

export default updateTodo;
