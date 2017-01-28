import {compute} from 'cerebral'
import {state} from 'cerebral/tags'
import computeVisibleTodosRefs from './visibleTodosRefs'

export default compute(
  computeVisibleTodosRefs,
  (visibleTodosRefs, get) => {
    return visibleTodosRefs.filter((ref) => {
      return !get(state`app.todos.${ref}.completed`)
    }).length === 0 && visibleTodosRefs.length !== 0
  }
)
