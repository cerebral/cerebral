function editTodo ({input, state}) {

  const path = ['todos', input.ref];
  let todo = state.get(path);

  state.merge(path, {
    $isEditing: !todo.$isSaving && true
  });

};

export default editTodo;
