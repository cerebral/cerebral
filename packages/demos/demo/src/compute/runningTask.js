import {compute} from 'cerebral'
import {state} from 'cerebral/tags'
import {elapsedSeconds} from '../helpers/dateTime'
import {isRunning} from '../modules/tasks/helpers'

export default compute(
  state`tasks.$now`,
  state`tasks.$draft`,
  (now, task) => {
    if (isRunning(task)) {
      const elapsed = elapsedSeconds(task.startedAt, now)

      return Object.assign({}, task, {elapsed})
    }

    return Object.assign({}, task, {elapsed: 0})
  }
)
