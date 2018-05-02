import { Context, computedPath, statePath } from 'cerebral.proxy'

export function toggleAllChecked({ state, computed }: Context) {
  const isCompleted = !computed.get(computedPath.isAllChecked)
  const currentTodosUids = computed.get(computedPath.visibleTodosUids)

  currentTodosUids.forEach((uid) => {
    state.set(statePath.todos[uid].completed, isCompleted)
  })
}

export function addTodo({ state, id }: Context) {
  state.set(statePath.todos[id.create()], {
    title: state.get('newTodoTitle'),
    completed: false,
  })
}

export function clearCompletedTodos({ state }: Context) {
  const todos = state.get(statePath.todos)

  Object.keys(todos).forEach((uid) => {
    if (todos[uid].completed) {
      state.unset(statePath.todos[uid])
    }
  })
}
