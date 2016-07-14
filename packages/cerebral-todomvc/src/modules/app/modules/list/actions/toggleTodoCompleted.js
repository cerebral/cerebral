function toggleTodoCompleted ({input, state}) {
  let todo = state.select(`app.list.todos.${input.ref}`)
  todo.set('completed', !todo.get('completed'))
}

export default toggleTodoCompleted
