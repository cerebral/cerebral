function addTodo ({state, output, services, module}) {

  var ref = services.refs.next(state);
  let todo = {
    $ref: ref,
    $isSaving: true,
    title: state.get([module, 'title']),
    completed: false
  };

  state.set(['list', 'todos', ref], todo);
  state.set([module, 'title'], '');

  output({
    ref: ref
  });

};

export default addTodo;
