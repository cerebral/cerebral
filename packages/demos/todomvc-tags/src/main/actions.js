import { state } from 'cerebral'

export function toggleAllChecked({ store, get }) {
  const isCompleted = !get(state`isAllChecked`)
  const uids = get(state`uids`)

  uids.forEach((uid) => {
    store.set(state`todos.${uid}.completed`, isCompleted)
  })
}

export function addTodo({ store, get, id }) {
  store.set(state`todos.${id.create()}`, {
    title: get(state`newTodoTitle`),
    completed: false,
  })
}

export function clearCompletedTodos({ store, get }) {
  const todos = get(state`todos`)

  Object.keys(todos).forEach((uid) => {
    if (todos[uid].completed) {
      store.unset(state`todos.${uid}`)
    }
  })
}
