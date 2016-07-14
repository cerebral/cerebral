function setTodoNewTitle ({input, state}) {
  state.merge(`app.list.todos.${input.ref}`, {
    $newTitle: input.title
  })
}

export default setTodoNewTitle
