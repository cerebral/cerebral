let removeTodo = function(cerebral, todo) {
  var path = todo.getPath();
  var index = path.pop();
  cerebral.splice(path, index, 1);
};

export default removeTodo;