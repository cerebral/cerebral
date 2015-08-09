function setTodoNewTitle (args, state) {
  state.merge(['todos', args.ref], {
    $newTitle: args.title
  });
};

export default setTodoNewTitle;
