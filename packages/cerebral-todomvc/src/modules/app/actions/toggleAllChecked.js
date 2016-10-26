import isAllChecked from '../../../computed/isAllChecked'
import visibleTodosRefs from '../../../computed/visibleTodosRefs'

function toggleAllChecked ({state}) {
  const isCompleted = !state.compute(isAllChecked())
  const currentTodosKeys = state.compute(visibleTodosRefs())

  currentTodosKeys.forEach((ref) => {
    state.set(`app.todos.${ref}.completed`, isCompleted)
  })
}

export default toggleAllChecked
