import isAllChecked from '../../../computed/isAllChecked'
import visibleTodosRefs from '../../../computed/visibleTodosRefs'

function toggleAllChecked ({state, resolve}) {
  const isCompleted = !resolve.value(isAllChecked)
  const currentTodosKeys = resolve.value(visibleTodosRefs)

  currentTodosKeys.forEach((ref) => {
    state.set(`app.todos.${ref}.completed`, isCompleted)
  })
}

export default toggleAllChecked
