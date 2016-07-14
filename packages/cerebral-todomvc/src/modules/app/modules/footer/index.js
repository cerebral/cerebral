import clearCompleted from './chains/clearCompleted'
import setFilter from './chains/setFilter'

export default (options = {}) => {
  return (module) => {
    module.addState({
      filter: 'all'
    })

    module.addSignals({
      clearCompletedClicked: clearCompleted,
      filterClicked: setFilter
    })
  }
}
