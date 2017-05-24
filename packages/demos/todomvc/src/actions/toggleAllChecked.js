import computedIsAllChecked from '../computed/isAllChecked'
import computedVisibleTodosUids from '../computed/visibleTodosUids'

function toggleAllChecked ({state, resolve}) {
  const isCompleted = !resolve.value(computedIsAllChecked)
  const currentTodosUids = resolve.value(computedVisibleTodosUids)

  currentTodosUids.forEach((uid) => {
    state.set(`todos.${uid}.completed`, isCompleted)
  })
}

export default toggleAllChecked
