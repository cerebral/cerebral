let removeTodo = function(store, todo) {
  var path = todo.getPath();
  var index = path.pop();
  store.splice(path, index, 1);
};

export default removeTodo;