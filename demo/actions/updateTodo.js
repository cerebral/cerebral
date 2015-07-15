let updateTodo = function(args, state) {

console.log('updating');

  var path = ['todos', args.ref];

  let todo = state.get(path);

  state.merge(path, {
    id: args.id,
    $isSaving: false
  });

};

export default updateTodo;
