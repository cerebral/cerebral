let editTodo = function (args, state) {

  const path = ['todos', args.ref];
  let todo = cerebral.get(path);

  cerebral.merge(path, {
    $isEditing: !todo.$isSaving && true
  });

};

export default editTodo;
