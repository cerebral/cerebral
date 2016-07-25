import {Computed} from 'cerebral'

export default Computed({
  todos: 'app.todos'
}, state => {
  return Object.keys(state.todos).reduce(function (counts, ref) {
    let todo = state.todos[ref]

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
