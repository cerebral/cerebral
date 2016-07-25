function removeTodo ({input, state}) {
  state.unset(`app.todos.${input.ref}`)
}

export default removeTodo
