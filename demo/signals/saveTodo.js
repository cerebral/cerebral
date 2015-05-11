let saveTodo = function (store, ref) {
  return new Promise(function (resolve, reject) {
    
    setTimeout(function () {
      resolve({
        ref: ref,
        $isSaving: false
      });
    }, 3000);

  });
};

export default saveTodo;