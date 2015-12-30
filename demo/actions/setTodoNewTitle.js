function setTodoNewTitle ({input, state}) {
  state.merge(['todos', input.ref], {
    $newTitle: input.title
  });
};

export default setTodoNewTitle;
