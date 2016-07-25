function editTodo ({input, state}) {
  state.set(`app.todos.${input.ref}.$isEditing`, true)
}

export default editTodo
