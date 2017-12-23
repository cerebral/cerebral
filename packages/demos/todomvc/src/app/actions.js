import computedIsAllChecked from '../computed/isAllChecked'
import computedVisibleTodosUids from '../computed/visibleTodosUids'

export function toggleAllChecked({ state, resolve }) {
  const isCompleted = !resolve.value(computedIsAllChecked)
  const currentTodosUids = resolve.value(computedVisibleTodosUids)

  currentTodosUids.forEach(uid => {
    state.set(`todos.${uid}.completed`, isCompleted)
  })
}

export function addTodo({ state, id }) {
  state.set(`todos.${id.create()}`, {
    title: state.get('newTodoTitle'),
    completed: false,
  })
}

export function clearCompletedTodos({ state }) {
  const todos = state.get('todos')

  Object.keys(todos).forEach(uid => {
    if (todos[uid].completed) {
      state.unset(`todos.${uid}`)
    }
  })
}
