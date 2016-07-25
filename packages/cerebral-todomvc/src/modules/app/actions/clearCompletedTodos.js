function clearCompleted ({state}) {
  const todos = state.get('app.todos')

  Object.keys(todos).forEach((ref) => {
    if (todos[ref].completed && !todos[ref].$isSaving) {
      state.unset(`app.todos.${ref}`)
    }
  })
}

export default clearCompleted
