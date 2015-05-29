let stopEditingTodo = function (cerebral, ref) {

  let todo = cerebral.get(['todos', ref]);

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