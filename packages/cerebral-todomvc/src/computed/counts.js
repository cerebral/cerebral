import {Computed} from 'cerebral'

export default Computed({
  todos: 'app.todos.**'
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
