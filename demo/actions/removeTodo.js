function removeTodo ({input, state}) {
  state.unset(['todos', input.ref]);
};

export default removeTodo;
