let removeTodo = function(args, state) {
  state.unset('todos', args.ref);
};

export default removeTodo;
