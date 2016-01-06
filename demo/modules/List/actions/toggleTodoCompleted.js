function toggleTodoCompleted ({input, state, module}) {
  const path = [module, 'todos', input.ref];
  let todo = state.get(path);
  state.set(path.concat('completed'), !todo.completed);
};

export default toggleTodoCompleted;
