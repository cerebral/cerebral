function editTodo ({input, state}) {
  let todo = state.get(`app.list.todos.${input.ref}`)

  state.merge(`app.list.todos.${input.ref}`, {
    $isEditing: !todo.$isSaving
  })
}

export default editTodo
