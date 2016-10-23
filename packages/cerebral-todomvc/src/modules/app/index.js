import redirectToAll from './chains/redirectToAll'
import setTitle from './chains/setTitle'
import submitTodo from './chains/submitTodo'
import setTodoNewTitle from './chains/setTodoNewTitle'
import overwriteTodoTitle from './chains/overwriteTodoTitle'
import removeTodo from './chains/removeTodo'
import editTodo from './chains/editTodo'
import toggleAllChecked from './chains/toggleAllChecked'
import toggleTodoCompleted from './chains/toggleTodoCompleted'
import stopEditingTodo from './chains/stopEditingTodo'
import clearCompletedTodos from './chains/clearCompletedTodos'
import setFilter from './chains/setFilter'

export default {
  state: {
    newTodoTitle: '',
    todos: {},
    filter: 'all',
    isSaving: false
  },
  signals: {
    rootRouted: redirectToAll,
    newTodoTitleChanged: setTitle,
    newTodoSubmitted: submitTodo,
    todoNewTitleChanged: setTodoNewTitle,
    todoNewTitleSubmitted: overwriteTodoTitle,
    removeTodoClicked: removeTodo,
    todoDoubleClicked: editTodo,
    toggleAllChanged: toggleAllChecked,
    toggleTodoCompletedChanged: toggleTodoCompleted,
    todoNewTitleAborted: stopEditingTodo,
    clearCompletedClicked: clearCompletedTodos,
    filterClicked: setFilter
  }
}
