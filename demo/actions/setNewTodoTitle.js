function setNewTodoTitle ({input, state}) {
  state.set('newTodoTitle', input.title);
};

export default setNewTodoTitle;
