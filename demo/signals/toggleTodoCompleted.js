let toggleTodoCompleted = function(store, todo) {
  store.set([todo, 'completed'], !todo.completed);
};

export default toggleTodoCompleted;