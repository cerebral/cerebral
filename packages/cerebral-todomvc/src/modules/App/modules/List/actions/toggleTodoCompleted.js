function toggleTodoCompleted ({input, state, module}) {
  const todoPath = ['todos', input.ref];
  let todo = module.state.get(todoPath);
  module.state.set([...todoPath, 'completed'], !todo.completed);
};

export default toggleTodoCompleted;
