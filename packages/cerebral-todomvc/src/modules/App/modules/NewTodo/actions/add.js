function addTodo ({state, output, services}) {

  var ref = services.refs.next(state);
  let todo = {
    $ref: ref,
    $isSaving: true,
    title: state.get('app.new.title'),
    completed: false
  };

  state.set(`app.list.todos.${ref}`, todo);
  state.set('app.new.title', '');

  output({
    ref: ref
  });

};

export default addTodo;
