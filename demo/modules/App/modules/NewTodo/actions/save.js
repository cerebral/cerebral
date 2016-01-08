function saveTodo ({input, state, output, modules}) {

  let todo = modules.app.list.state.get(['todos', input.ref]);

  // Simulating posting the todo.data and get an ID from
  // the server. We resolve with the new id
  setTimeout(function () {

    output.success({
      id: Date.now() + parseInt(Math.random() * 1000)
    });

    // Or error

  }, 2000);

};

export default saveTodo;
