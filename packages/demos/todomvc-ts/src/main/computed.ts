import { Compute } from 'cerebral'
import { state } from 'app.cerebral'

export const uids = Compute((get) => {
  const filter = get(state.filter)
  const todos = get(state.todos)
  return Object.keys(todos).filter((uid) => {
    return (
      filter === 'all' ||
      (filter === 'completed' && todos[uid].completed) ||
      (filter === 'active' && !todos[uid].completed)
    )
  })
})

export const counts = Compute((get) => {
  const todos = get(state.todos)
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
      total: 0,
      visible: todosUids.length,
    }
  )
})

export const isAllChecked: boolean = Compute((get) => {
  const uids = get(state.uids)
  return (
    uids.filter((uid) => {
      const todo = get(state.todos[uid])

      return !todo.completed
    }).length === 0 && uids.length !== 0
  )
})
