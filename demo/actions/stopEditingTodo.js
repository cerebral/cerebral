let stopEditingTodo = function (cerebral, todo) {
  todo = cerebral.getByRef('todos', todo.$ref);

  if (!todo.$newTitle) {
    return;
  }

  cerebral.merge(todo, {
    $isEditing: false,
    title: todo.$newTitle
  });
  cerebral.unset(todo, '$newTitle');
};

export default stopEditingTodo;