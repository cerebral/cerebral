import {compute} from 'cerebral'
import computeVisibleTodosRefs from './visibleTodosRefs'
import {state} from 'cerebral/tags'

export default compute(
  computeVisibleTodosRefs,
  state`app.todos`,
  (visibleTodosRefs, todos) => {
    return visibleTodosRefs.filter((ref) => {
      return !todos[ref].completed
    }).length === 0 && visibleTodosRefs.length !== 0
  }
)
