let toggleTodoCompleted = (cerebral, ref) => {
  let todo = cerebral.get(['todos', ref]);
  cerebral.set([todo, 'completed'], !todo.completed);
};

export default toggleTodoCompleted;
