import {compute} from 'cerebral'
import {state} from 'cerebral/tags'

export default compute(
  state`app.todos.**`,
  (todos) => {
    return Object.keys(todos).reduce((counts, ref) => {
      let todo = todos[ref]

      if (todo.completed) {
        counts.completedCount++
      } else if (!todo.completed) {
        counts.remainingCount++
      }

      return counts
    }, {
      completedCount: 0,
      remainingCount: 0
    })
  }
)
