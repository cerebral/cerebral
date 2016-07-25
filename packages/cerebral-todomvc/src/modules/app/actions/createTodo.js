import uuid from 'uuid'

function createTodo ({input, state, output}) {
  const ref = uuid.v4()
  const todo = {
    $isSaving: true,
    title: state.get('app.newTodoTitle'),
    completed: false
  }

  state.set(`app.todos.${ref}`, todo)
  output({ref})
}

export default createTodo
