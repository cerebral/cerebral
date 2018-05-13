import { Computed } from 'cerebral'
import { state, computed } from 'cerebral.proxy'

export const visibleTodosUids = Computed(
  {
    todos: state.todos,
    filter: state.filter,
  },
  ({ todos, filter }) => {
    return Object.keys(todos).filter((uid) => {
      return (
        filter === 'all' ||
        (filter === 'completed' && todos[uid].completed) ||
        (filter === 'active' && !todos[uid].completed)
      )
    })
  }
)

export const counts = Computed(
  {
    todos: state.todos,
  },
  ({ todos }) => {
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

export const isAllChecked: boolean = Computed(
  {
    uids: computed.visibleTodosUids,
  },
  ({ uids, get }) => {
    return (
      uids.filter((uid) => {
        const todo = get(state.todos[uid])

        return !todo.completed
      }).length === 0 && uids.length !== 0
    )
  }
)
