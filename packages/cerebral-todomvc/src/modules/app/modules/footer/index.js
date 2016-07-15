import clearCompletedTodos from './chains/clearCompletedTodos'
import setFilter from './chains/setFilter'

export default (options = {}) => {
  return (module) => {
    module.addState({
      filter: 'all'
    })

    module.addSignals({
      clearCompletedClicked: clearCompletedTodos,
      filterClicked: setFilter
    })
  }
}
