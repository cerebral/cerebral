import {Computed} from 'cerebral'
import visibleTodosRefs from './visibleTodosRefs'
import {state} from 'cerebral/tags'

export default Computed({
  visibleTodosRefs: visibleTodosRefs,
  todos: state`app.todos.**`
}, props => {
  return props.visibleTodosRefs.filter((ref) => {
    return !props.todos[ref].completed
  }).length === 0 && props.visibleTodosRefs.length !== 0
})
