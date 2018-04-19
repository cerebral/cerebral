import { IState } from './types'

export function counts(state: IState) {
  return state.visibleTodosUids.get().reduce(
    (currentCounts, uid) => {
      const todo = state.todos.get(uid)

      if (todo && todo.completed) {
        currentCounts.completed++
      } else {
        currentCounts.remaining++
      }

      currentCounts.total++

      return currentCounts
    },
    {
      completed: 0,
      remaining: 0,
      total: state.todos.values().length,
      visible: state.visibleTodosUids.get().length,
    }
  )
}
export function visibleTodosUids(state: IState): string[] {
  return state.todos.keys().filter((uid) => {
    const todo = state.todos.get(uid)

    return (
      state.filter === 'all' ||
      (state.filter === 'completed' && todo && todo.completed) ||
      (state.filter === 'active' && todo && !todo.completed)
    )
  })
}
export function isAllChecked(state: IState) {
  return (
    state.visibleTodosUids.get().filter((uid) => {
      const todo = state.todos.get(uid)

      return todo && !todo.completed
    }).length === 0 && state.visibleTodosUids.get().length !== 0
  )
}
