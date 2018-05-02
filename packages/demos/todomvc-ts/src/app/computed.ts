import { Compute } from 'cerebral'
import { state, computed } from 'cerebral.proxy'

export const visibleTodosUids = Compute(state.todos, state.filter)(
  (todos, filter) => {
    return Object.keys(todos).filter((uid) => {
      return (
        filter === 'all' ||
        (filter === 'completed' && todos[uid].completed) ||
        (filter === 'active' && !todos[uid].completed)
      )
    })
  }
)

export const counts = Compute(state.todos, computed.visibleTodosUids)(
  (todos, visibleTodosUids) => {
    const todosUids = Object.keys(todos)

    return todosUids.reduce(
      (counts, uid) => {
        if (todos[uid].completed) {
          counts.completed++
        } else {
          counts.remaining++
        }

        counts.total++

        return counts
      },
      {
        completed: 0,
        remaining: 0,
        total: Object.keys(todos).length,
        visible: todosUids.length,
      }
    )
  }
)

export const isAllChecked = Compute(computed.visibleTodosUids)(
  (visibleTodosUids, get) => {
    return (
      visibleTodosUids.filter((uid) => {
        const todo = get(state.todos[uid])

        return !todo.completed
      }).length === 0 && visibleTodosUids.length !== 0
    )
  }
)
