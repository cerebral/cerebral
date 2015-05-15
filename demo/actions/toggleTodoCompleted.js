let toggleTodoCompleted = function(cerebral, todo) {
  cerebral.set([todo, 'completed'], !todo.completed);
};

export default toggleTodoCompleted;