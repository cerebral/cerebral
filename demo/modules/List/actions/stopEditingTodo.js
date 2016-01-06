function stopEditingTodo ({input, state, module}) {

  const path = [module, 'todos', input.ref];
  let todo = state.get(path);

  if (!todo.$newTitle) {
    return;
  }

  state.merge(path, {
    $isEditing: false,
    title: todo.$newTitle
  });
  state.unset(path.concat('$newTitle'));
};

export default stopEditingTodo;
