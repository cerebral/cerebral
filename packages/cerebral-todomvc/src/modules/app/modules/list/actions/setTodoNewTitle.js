function setTodoNewTitle ({input, state}) {
  state.set(`app.list.todos.${input.ref}.$newTitle`, input.title)
}

export default setTodoNewTitle
