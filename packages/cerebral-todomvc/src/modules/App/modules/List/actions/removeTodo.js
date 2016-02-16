function removeTodo ({input, state}) {
  state.unset(`app.list.todos.${input.ref}`);
};

export default removeTodo;
