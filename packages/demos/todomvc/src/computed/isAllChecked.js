import {compute} from 'cerebral'
import {state} from 'cerebral/tags'
import computedVisibleTodosUids from './visibleTodosUids'

export default compute(
  computedVisibleTodosUids,
  (visibleTodosUids, get) => {
    return visibleTodosUids.filter((uid) => {
      const todo = get(state`todos.${uid}`)

      return !todo.completed
    }).length === 0 && visibleTodosUids.length !== 0
  }
)
