let saveTodo = function (cerebral, ref) {
  return new Promise(function (resolve, reject) {
    
    let todo = cerebral.get('todos', ref);
    console.log('ref', ref);
    // Simulating posting the todo.data and get an ID from
    // the server. We resolve with the new id and the ref
    setTimeout(function () {
      console.log('resolving');
      resolve({
        ref: ref,
        id: Date.now() + parseInt(Math.random() * 1000)
      });
    }, 1000);

  });
};

export default saveTodo;