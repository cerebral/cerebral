import {Computed} from 'cerebral'
import visibleTodos from './visibleTodos'

export default Computed({
  todos: visibleTodos()
}, state => {
  return state.todos.filter(function (todo) {
    return !todo.completed
  }).length === 0 && state.todos.length !== 0
})
