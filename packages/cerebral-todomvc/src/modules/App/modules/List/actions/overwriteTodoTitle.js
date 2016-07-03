function overwriteTodoTitle ({input, state}) {
  const todo = state.select(`app.list.todos.${input.ref}`)
  todo.set('title', todo.get('$newTitle'))
}

export default overwriteTodoTitle
