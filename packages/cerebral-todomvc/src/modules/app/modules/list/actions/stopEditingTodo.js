function stopEditingTodo ({input, state}) {
  state.set(`app.list.todos.${input.ref}.$isEditing`, false)
  state.unset(`app.list.todos.${input.ref}.$newTitle`)
}

export default stopEditingTodo
