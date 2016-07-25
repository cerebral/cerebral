import {Computed} from 'cerebral'

export default Computed({
  todos: 'app.todos',
  filter: 'app.filter'
}, state => {
  return Object.keys(state.todos).filter((ref) => {
    const todo = state.todos[ref]

    return (
      state.filter === 'all' ||
      (state.filter === 'completed' && todo.completed) ||
      (state.filter === 'active' && !todo.completed)
    )
  })
})
