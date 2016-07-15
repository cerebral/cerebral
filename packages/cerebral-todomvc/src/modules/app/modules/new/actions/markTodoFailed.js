function markTodoFailed ({input, state}) {
  state.merge(`app.list.todos.${input.ref}`, {
    id: input.id,
    $isSaving: false,
    $error: input.error
  })
}

export default markTodoFailed
