function saveTodo (args, state, next) {

  let todo = state.get('todos', args.ref);

  // Simulating posting the todo.data and get an ID from
  // the server. We resolve with the new id
  setTimeout(function () {

    next.success({
      id: Date.now() + parseInt(Math.random() * 1000)
    });

  }, 1000);

};

export default saveTodo;
