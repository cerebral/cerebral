function editTodo ({input, state, module}) {

  const path = [module, 'todos', input.ref];
  let todo = state.get(path);

  state.merge(path, {
    $isEditing: !todo.$isSaving
  });

};

export default editTodo;
