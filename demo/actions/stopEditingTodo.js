let stopEditingTodo = function (args, state) {

  const path = ['todos', args.ref];
  let todo = cerebral.get(path);

  if (!todo.$newTitle) {
    return;
  }

  cerebral.merge(path, {
    $isEditing: false,
    title: todo.$newTitle
  });
  state.unset(todo, '$newTitle');
};

export default stopEditingTodo;
