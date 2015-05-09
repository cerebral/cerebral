let saveTodo = function (store, todo) {
  return new Promise(function (resolve, reject) {
    
    setTimeout(function () {
      todo.$isSaving = false;
      resolve(todo);
    }, 1000);

  });
};

export default saveTodo;