import {compute} from 'cerebral'
import {state} from 'cerebral/tags'

export default compute(
  state`app.todos.**`,
  state`app.filter`,
  (todos, filter) => {
    return Object.keys(todos).filter((ref) => {
      const todo = todos[ref]

      return (
        filter === 'all' ||
        (filter === 'completed' && todo.completed) ||
        (filter === 'active' && !todo.completed)
      )
    })
  }
)
