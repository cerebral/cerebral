function addTodo ({state, uuid}) {
  state.set(`todos.${uuid.v4()}`, {
    title: state.get('newTodoTitle'),
    completed: false
  })
}

export default addTodo
