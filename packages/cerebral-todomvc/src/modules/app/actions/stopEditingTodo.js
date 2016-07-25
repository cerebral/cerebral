function stopEditingTodo ({input, state}) {
  state.set(`app.todos.${input.ref}.$isEditing`, false)
  state.unset(`app.todos.${input.ref}.$newTitle`)
}

export default stopEditingTodo
