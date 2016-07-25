function overwriteTodoTitle ({input, state}) {
  const todoPath = `app.todos.${input.ref}`

  state.set(`${todoPath}.title`, state.get(`${todoPath}.$newTitle`))
}

export default overwriteTodoTitle
