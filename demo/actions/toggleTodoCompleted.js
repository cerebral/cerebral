function toggleTodoCompleted ({input, state}) {
  const path = ['todos', input.ref];
  let todo = state.get(path);
  state.set(path.concat('completed'), !todo.completed);
};

export default toggleTodoCompleted;
