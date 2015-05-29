let setTodoNewTitle = function (cerebral, ref, title) {
  cerebral.merge(['todos', ref], {
    $newTitle: title
  });
};

export default setTodoNewTitle;