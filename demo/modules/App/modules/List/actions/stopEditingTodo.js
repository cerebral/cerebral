function stopEditingTodo ({input, state, module}) {

  const todoPath = ['todos', input.ref];
  let todo = state.get(todoPath);

  if (!todo.$newTitle) {
    return;
  }

  state.merge(todoPath, {
    $isEditing: false,
    title: todo.$newTitle
  });
  state.unset([...todoPath, '$newTitle']);
};

export default stopEditingTodo;
