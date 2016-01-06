function removeTodo ({input, state, module}) {
  state.unset([module, 'todos', input.ref]);
};

export default removeTodo;
