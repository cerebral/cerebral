function removeTodo (args, state) {
  state.unset(['todos', args.ref]);
};

export default removeTodo;
