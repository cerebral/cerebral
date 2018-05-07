import { Context, state, computed } from 'cerebral.proxy'

export function toggleAllChecked({ operators, get }: Context) {
  const isCompleted = !get(computed.isAllChecked)
  const currentTodosUids = get(computed.visibleTodosUids)

  currentTodosUids.forEach((uid) => {
    operators.set(state.todos[uid].completed, isCompleted)
  })
}

export function addTodo({ get, operators, id }: Context) {
  operators.set(state.todos[id.create()], {
    title: get(state.newTodoTitle),
    completed: false,
  })
}

export function clearCompletedTodos({ operators, get }: Context) {
  const todos = get(state.todos)

  Object.keys(todos).forEach((uid) => {
    if (todos[uid].completed) {
      operators.unset(state.todos[uid])
    }
  })
}
