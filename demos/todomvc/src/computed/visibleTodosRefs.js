import {compute} from 'cerebral'
import {state} from 'cerebral/tags'

export default compute(
  state`app.todos.*`,
  state`app.filter`,
  (todosRefs, filter, get) => {
    return todosRefs.filter((ref) => {
      const completed = get(state`app.todos.${ref}.completed`)

      return (
        filter === 'all' ||
        (filter === 'completed' && completed) ||
        (filter === 'active' && !completed)
      )
    })
  }
)
