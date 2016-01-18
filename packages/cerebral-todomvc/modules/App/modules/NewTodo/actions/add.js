function addTodo ({state, output, services, module, modules}) {

  var ref = services.refs.next(state);
  let todo = {
    $ref: ref,
    $isSaving: true,
    title: module.state.get(['title']),
    completed: false
  };

  modules.app.list.state.set(['todos', ref], todo);
  module.state.set(['title'], '');

  output({
    ref: ref
  });

};

export default addTodo;
