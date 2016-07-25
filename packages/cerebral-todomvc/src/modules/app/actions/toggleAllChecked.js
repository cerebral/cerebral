import isAllChecked from '../../../computed/isAllChecked.js'
import visibleTodosRefs from '../../../computed/visibleTodosRefs.js'

function toggleAllChecked ({state}) {
  const isCompleted = !state.computed(isAllChecked())
  const currentTodosKeys = state.computed(visibleTodosRefs())

  currentTodosKeys.forEach((ref) => {
    state.set(`app.todos.${ref}.completed`, isCompleted)
  })
}

export default toggleAllChecked
