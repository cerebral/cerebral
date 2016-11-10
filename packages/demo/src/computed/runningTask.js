import {Computed} from 'cerebral'
import {elapsedSeconds} from '../helpers/dateTime'

export default Computed(
  {
    now: 'tasks.$now',
    task: 'tasks.$running.**'
  },
  ({now, task}) => {
    if (task.startedAt) {
      const elapsed = elapsedSeconds(task.startedAt, now)
      return Object.assign({}, task, {endedAt: now, elapsed})
    } else {
      return task
    }
  }
)
