let setTodoNewTitle = function (cerebral, todo, title) {
  todo = cerebral.get('todos', todo.$ref);
  cerebral.merge(todo, {
    $newTitle: title
  });
};

export default setTodoNewTitle;