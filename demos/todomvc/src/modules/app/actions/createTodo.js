import uuid from 'uuid'

function createTodo ({state}) {
  const ref = uuid.v4()
  const todo = {
    $isSaving: true,
    title: state.get('app.newTodoTitle'),
    completed: false
  }

  state.set(`app.todos.${ref}`, todo)
  return {ref}
}

export default createTodo
