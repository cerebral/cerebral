let setTodoNewTitle = function (args, state) {
  state.merge(['todos', args.ref], {
    $newTitle: args.title
  });
};

export default setTodoNewTitle;
