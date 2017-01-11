import {Computed} from 'cerebral'
import {state} from 'cerebral/tags'

export default Computed({
  todos: state`app.todos.**`
}, props => {
  return Object.keys(props.todos).reduce((counts, ref) => {
    let todo = props.todos[ref]

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
})
