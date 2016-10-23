import isAllChecked from '../../../computed/isAllChecked'
import visibleTodosRefs from '../../../computed/visibleTodosRefs'

function toggleAllChecked ({controller, state}) {
  const isCompleted = !isAllChecked().getValue(controller)
  const currentTodosKeys = visibleTodosRefs().getValue(controller)

  currentTodosKeys.forEach((ref) => {
    state.set(`app.todos.${ref}.completed`, isCompleted)
  })
}

export default toggleAllChecked
