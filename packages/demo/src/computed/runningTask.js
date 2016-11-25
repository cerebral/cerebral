import {Computed} from 'cerebral'
import {elapsedSeconds} from '../helpers/dateTime'
import {isRunning} from '../helpers/task'

export default Computed(
  {
    now: 'tasks.$now',
    task: 'tasks.$draft.**'
  },
  ({now, task}) => {
    if (isRunning(task)) {
      const elapsed = elapsedSeconds(task.startedAt, now)
      return Object.assign({}, task, {endedAt: now, elapsed})
    } else {
      return task
    }
  }
)
