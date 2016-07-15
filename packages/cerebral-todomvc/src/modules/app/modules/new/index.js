import submitTodo from './chains/submitTodo'
import setTitle from './chains/setTitle'

export default (options = {}) => {
  return (module) => {
    module.addState({
      title: ''
    })

    module.addSignals({
      titleChanged: {
        chain: setTitle,
        immediate: true
      },
      submitted: submitTodo
    })
  }
}
