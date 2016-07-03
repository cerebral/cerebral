import computed from 'cerebral-computed'

export default computed({
  todos: 'app.list.todos',
  filter: 'app.footer.filter'
}, state => {
  return Object.keys(state.todos).filter(function (key) {
    let todo = state.todos[key]
    return (
      state.filter === 'all' ||
      (state.filter === 'completed' && todo.completed) ||
      (state.filter === 'active' && !todo.completed)
    )
  })
})
