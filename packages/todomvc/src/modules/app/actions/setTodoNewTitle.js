function setTodoNewTitle ({input, state}) {
  state.set(`app.todos.${input.ref}.$newTitle`, input.title)
}

export default setTodoNewTitle
