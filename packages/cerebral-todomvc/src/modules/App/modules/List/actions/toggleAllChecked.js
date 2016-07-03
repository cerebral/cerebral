function toggleAllChecked ({state}) {
  let isCompleted = !state.get('app.list.isAllChecked')
  let todos = state.get('app.list.todos')

  Object.keys(todos).forEach(function (key) {
    let todo = todos[key]
    state.set(`app.list.todos.${todo.$ref}.completed`, isCompleted)
  })

  state.set('app.list.isAllChecked', isCompleted)
}

export default toggleAllChecked
