function toggleTodoCompleted (args, state) {
  console.log(args);
  const path = ['todos', args.ref];
  let todo = state.get(path);
  state.set(path.concat('completed'), !todo.completed);
};

export default toggleTodoCompleted;
