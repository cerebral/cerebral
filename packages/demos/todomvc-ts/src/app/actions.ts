import { Context, state, computed } from 'cerebral.proxy'

export function toggleAllChecked({ mutation, get }: Context) {
  const isCompleted = !get(computed.isAllChecked)
  const currentTodosUids = get(computed.visibleTodosUids)

  currentTodosUids.forEach((uid) => {
    mutation.set(state.todos[uid].completed, isCompleted)
  })
}

export function addTodo({ get, mutation, id }: Context) {
  mutation.set(state.todos[id.create()], {
    title: get(state.newTodoTitle),
    completed: false,
  })
}

export function clearCompletedTodos({ mutation, get }: Context) {
  const todos = get(state.todos)

  Object.keys(todos).forEach((uid) => {
    if (todos[uid].completed) {
      mutation.unset(state.todos[uid])
    }
  })
}
