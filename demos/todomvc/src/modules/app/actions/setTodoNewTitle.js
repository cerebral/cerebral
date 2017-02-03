function setTodoNewTitle ({props, state}) {
  state.set(`app.todos.${props.ref}.$newTitle`, props.title)
}

export default setTodoNewTitle
