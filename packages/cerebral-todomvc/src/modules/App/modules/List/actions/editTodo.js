function editTodo ({input, state, module}) {

  const todoPath = ['todos', input.ref];
  let todo = module.state.get(todoPath);

  module.state.merge(todoPath, {
    $isEditing: !todo.$isSaving
  });

};

export default editTodo;
