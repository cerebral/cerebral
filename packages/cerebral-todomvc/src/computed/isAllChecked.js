import {Computed} from 'cerebral'
import visibleTodosRefs from './visibleTodosRefs'

export default Computed({
  visibleTodosRefs: visibleTodosRefs(),
  todos: 'app.todos'
}, props => {
  return props.visibleTodosRefs.filter((ref) => {
    return !props.todos[ref].completed
  }).length === 0 && props.visibleTodosRefs.length !== 0
})
