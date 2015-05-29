let editTodo = function (cerebral, ref) {

  let todo = cerebral.get(['todos', ref]);

  cerebral.merge(['todos', ref], {
    $isEditing: !todo.$isSaving && true
  });

};

export default editTodo;