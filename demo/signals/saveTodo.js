let saveTodo = function (store, todo) {
  return new Promise(function (resolve, reject) {
    
    setTimeout(function () {
      todo.$isSaving = false;
      resolve(todo);
    }, 3000);

  });
};

export default saveTodo;