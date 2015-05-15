let saveTodo = function (cerebral, todo) {
  return new Promise(function (resolve, reject) {
    
    setTimeout(function () {
      resolve({
        ref: todo.ref,
        $isSaving: false
      });
    }, 3000);

  });
};

export default saveTodo;