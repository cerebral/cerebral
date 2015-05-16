let setEditedTodo = function (cerebral, todo) {
  todo = cerebral.getByRef('todos', todo.$ref);
  cerebral.merge(todo, {
    $isEditing: !todo.$isSaving && true
  });
};

export default setEditedTodo;