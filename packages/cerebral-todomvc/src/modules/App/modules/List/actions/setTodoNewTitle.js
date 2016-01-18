function setTodoNewTitle ({input, state, module}) {

  module.state.merge(['todos', input.ref], {
    $newTitle: input.title
  });
};

export default setTodoNewTitle;
