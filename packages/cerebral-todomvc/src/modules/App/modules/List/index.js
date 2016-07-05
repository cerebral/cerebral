import setTodoNewTitle from './chains/setTodoNewTitle'
import overwriteTodoTitle from './chains/overwriteTodoTitle'
import removeTodo from './chains/removeTodo'
import editTodo from './chains/editTodo'
import toggleAllChecked from './chains/toggleAllChecked'
import toggleTodoCompleted from './chains/toggleTodoCompleted'
import stopEditingTodo from './chains/stopEditingTodo'

export default (options = {}) => {
  return (module) => {
    module.addState({
      todos: {},
      isAllChecked: false,
      editedTodo: null,
      showCompleted: true,
      showNotCompleted: true
    })

    module.addSignals({
      newTitleChanged: {
        chain: setTodoNewTitle,
        immediate: true
      },
      newTitleSubmitted: overwriteTodoTitle,
      removeTodoClicked: removeTodo,
      todoDoubleClicked: editTodo,
      toggleAllChanged: toggleAllChecked,
      toggleCompletedChanged: toggleTodoCompleted,
      newTitleAborted: stopEditingTodo
    })
  }
}
