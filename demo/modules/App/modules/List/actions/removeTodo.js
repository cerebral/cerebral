function removeTodo ({input, state, module}) {
  module.state.unset(['todos',  input.ref]);
};

export default removeTodo;
