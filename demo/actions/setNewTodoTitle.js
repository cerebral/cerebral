function setNewTodoTitle (input, state, output) {
  state.set('newTodoTitle', input.title);
};

export default setNewTodoTitle;
