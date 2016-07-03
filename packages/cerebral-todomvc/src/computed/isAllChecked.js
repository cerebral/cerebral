import computed from 'cerebral-computed'
import visibleTodos from './visibleTodos'

export default computed({
  todos: visibleTodos
}, state => {
  return state.todos.filter(function (todo) {
    return !todo.completed
  }).length === 0 && state.todos.length !== 0
})
