function stopEditingTodo (args, state) {

  const path = ['todos', args.ref];
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
