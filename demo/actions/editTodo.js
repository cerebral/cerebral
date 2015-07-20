let editTodo = function (args, state) {

  const path = ['todos', args.ref];
  let todo = state.get(path);

  state.merge(path, {
    $isEditing: !todo.$isSaving && true
  });

};

export default editTodo;
