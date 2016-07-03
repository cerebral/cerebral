import newTitleChanged from './signals/newTitleChanged'
import newTitleSubmitted from './signals/newTitleSubmitted'
import removeTodoClicked from './signals/removeTodoClicked'
import todoDoubleClicked from './signals/todoDoubleClicked'
import toggleAllChanged from './signals/toggleAllChanged'
import toggleCompletedChanged from './signals/toggleCompletedChanged'
import newTitleAborted from './signals/newTitleAborted'

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
      newTitleChanged,
      newTitleSubmitted,
      removeTodoClicked,
      todoDoubleClicked,
      toggleAllChanged,
      toggleCompletedChanged,
      newTitleAborted})
  }
}
