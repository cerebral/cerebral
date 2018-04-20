import { Compute } from 'cerebral'
import { state } from 'cerebral/proxy'
import computedVisibleTodosUids from './visibleTodosUids'

export default Compute(
  state.todos,
  computedVisibleTodosUids,
  (todos, visibleTodosUids, get) => {
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
