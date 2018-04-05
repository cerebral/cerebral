import { Compute } from 'cerebral'
import { state } from 'cerebral/proxy'
import computedVisibleTodosUids from './visibleTodosUids'

export default Compute(computedVisibleTodosUids, (visibleTodosUids, get) => {
  return (
    visibleTodosUids.filter((uid) => {
      const todo = get(state.todos[uid])

      return !todo.completed
    }).length === 0 && visibleTodosUids.length !== 0
  )
})
