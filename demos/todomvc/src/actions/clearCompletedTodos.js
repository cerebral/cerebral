function clearCompleted ({state}) {
  const todos = state.get('todos')

  Object.keys(todos).forEach((uid) => {
    if (todos[uid].completed) {
      state.unset(`todos.${uid}`)
    }
  })
}

export default clearCompleted
