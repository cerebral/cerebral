import {Computed} from 'cerebral'
import visibleTodosKeys from './visibleTodosKeys'

export default Computed({
  visibleTodosKeys: visibleTodosKeys(),
  todos: 'app.list.todos'
}, state => {
  return state.visibleTodosKeys.filter(function (key) {
    return !state.todos[key].completed
  }).length === 0 && state.visibleTodosKeys.length !== 0
})
