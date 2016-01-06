function setTodoNewTitle ({input, state, module}) {
  state.merge([module, 'todos', input.ref], {
    $newTitle: input.title
  });
};

export default setTodoNewTitle;
