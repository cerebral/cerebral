import { Compute } from 'cerebral'
import { state } from 'cerebral/proxy'

export default Compute(state.todos, state.filter, (todos, filter) => {
  return Object.keys(todos).filter((uid) => {
    return (
      filter === 'all' ||
      (filter === 'completed' && todos[uid].completed) ||
      (filter === 'active' && !todos[uid].completed)
    )
  })
})
