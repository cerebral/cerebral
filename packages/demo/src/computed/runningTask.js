import {Computed} from 'cerebral'
import {elapsedSeconds} from '../helpers/dateTime'
import {isRunning} from '../modules/tasks/helpers'

export default Computed(
  {
    now: 'tasks.$now',
    task: 'tasks.$draft.**'
  },
  ({now, task}) => {
    if (isRunning(task)) {
      const elapsed = elapsedSeconds(task.startedAt, now)
      return Object.assign({}, task, {elapsed})
    } else {
      return Object.assign({}, task, {elapsed: 0})
    }
  }
)
