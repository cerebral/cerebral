function stopEditingTodo ({input, state}) {

  let todo = state.select(`app.list.todos.${input.ref}`);

  todo.merge({
    $isEditing: false
  });
  todo.unset('$newTitle');
};

export default stopEditingTodo;
