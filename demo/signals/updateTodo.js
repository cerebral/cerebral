let updateTodo = function(store, updatedTodo) {
  let todo = store.get('todos').filter(function (todo) {
    return todo.ref === updatedTodo.ref;
  }).pop();
  store.merge(todo, updatedTodo);
};

export default updateTodo;