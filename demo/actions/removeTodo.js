let removeTodo = (cerebral, ref) => {
  cerebral.unset('todos', ref);
  cerebral.ref.remove(ref);
};

export default removeTodo;
