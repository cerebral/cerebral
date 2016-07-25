function toggleTodoCompleted ({input, state}) {
  const todoPath = `app.todos.${input.ref}`
  state.set(`${todoPath}.completed`, !state.get(`${todoPath}.completed`))
}

export default toggleTodoCompleted
