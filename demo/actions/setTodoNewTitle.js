let setTodoNewTitle = function (cerebral, id, title) {
  let ref = cerebral.ref.get(id);
  cerebral.merge(['todos', ref], {
    $newTitle: title
  });
};

export default setTodoNewTitle;