function updateTodo ({input, state}) {
  state.merge(`app.list.todos.${input.ref}`, {
    id: input.id,
    $isSaving: false
  })
}

export default updateTodo
