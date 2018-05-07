import { state, computed } from 'cerebral/proxy'

export function toggleAllChecked({ operators, get }) {
  const isCompleted = !get(computed.isAllChecked)
  const currentTodosUids = get(computed.visibleTodosUids)

  currentTodosUids.forEach((uid) => {
    operators.set(state.todos[uid].completed, isCompleted)
  })
}

export function addTodo({ operators, get, id }) {
  operators.set(state.todos[id.create()], {
    title: get(state.newTodoTitle),
    completed: false,
  })
}

export function clearCompletedTodos({ operators, get }) {
  const todos = get(state.todos)

  Object.keys(todos).forEach((uid) => {
    if (todos[uid].completed) {
      operators.unset(state.todos[uid])
    }
  })
}
