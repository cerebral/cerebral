import {Computed} from 'cerebral'

export default Computed({
  todos: 'app.list.todos'
}, state => {
  let counts = Object.keys(state.todos).reduce(function (counts, key) {
    let todo = state.todos[key]

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

  return {
    remainingCount: counts.remainingCount,
    completedCount: counts.completedCount
  }
})
