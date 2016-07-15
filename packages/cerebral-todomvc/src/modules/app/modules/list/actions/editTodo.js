function editTodo ({input, state}) {
  state.set(`app.list.todos.${input.ref}.$isEditing`, true)
}

export default editTodo
