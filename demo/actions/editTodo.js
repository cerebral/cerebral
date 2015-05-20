let editTodo = function (cerebral, id) {

  let ref = cerebral.ref.get(id);
  let todo = cerebral.get(['todos', ref]);

  cerebral.merge(['todos', ref], {
    $isEditing: !todo.$isSaving && true
  });

};

export default editTodo;