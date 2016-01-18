function updateTodo ({input, state, modules}) {

  var path = ['todos', input.ref];

  let todo = modules.app.list.state.get(path);

  modules.app.list.state.merge(path, {
    id: input.id,
    $isSaving: false
  });

};

export default updateTodo;
