import {compute} from 'cerebral'
import {state} from 'cerebral/tags'

export default compute(
  state`app.todos.*`,
  state`app.filter`,
  (todos, filter, get) => {
    return Object.keys(todos).filter((ref) => {
      const completed = get(state`app.todos.${ref}.completed`)

      return (
        filter === 'all' ||
        (filter === 'completed' && completed) ||
        (filter === 'active' && !completed)
      )
    })
  }
)
