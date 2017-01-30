import {compute} from 'cerebral'
import {state} from 'cerebral/tags'
import computeVisibleTodosRefs from './visibleTodosRefs'

export default compute(
  state`app.todos.*`,
  computeVisibleTodosRefs,
  (todos, visible, get) => {
    return Object.keys(todos).reduce((counts, ref) => {
      if (get(state`app.todos.${ref}.completed`)) {
        counts.completed++
      } else {
        counts.remaining++
      }

      counts.total++

      return counts
    }, {
      completed: 0,
      remaining: 0,
      total: 0,
      visible: visible.length
    })
  }
)
