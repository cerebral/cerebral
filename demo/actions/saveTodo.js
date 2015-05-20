let saveTodo = function (cerebral, todo) {
  return new Promise(function (resolve, reject) {
    
    // Simulating posting the todo.data and get an ID from
    // the server. We resolve with the new id and the ref
    setTimeout(function () {
      resolve({
        data: {
          id: Date.now() + parseInt(Math.random() * 1000),
        },
        ref: todo.ref
      });
    }, 3000);

  });
};

export default saveTodo;