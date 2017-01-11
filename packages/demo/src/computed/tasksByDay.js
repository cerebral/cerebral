import {Computed} from 'cerebral'
import {state} from 'cerebral/tags'
import {elapsedSeconds, sortDayString} from '../helpers/dateTime'
import paths from '../common/Collection/paths'

const {collectionPath} = paths('tasks')

export default Computed(
  {
    now: state`tasks.$now`,
    tasks: state`${collectionPath}.**`
  },
  ({now, tasks}) => {
    const days = {}
    const result = []
    Object.keys(tasks).forEach(key => {
      const task = tasks[key]
      if (!task.startedAt) {
        return
      }
      const dayDate = sortDayString(task.startedAt)
      let list = days[dayDate]
      if (!list) {
        list = []
        days[dayDate] = list
        result.push({
          dayDate,
          date: task.startedAt,
          tasks: list
        })
      }

      if (!task.endedAt) {
        const elapsed = elapsedSeconds(task.startedAt, now)
        list.push(Object.assign({}, task, {elapsed}))
      } else {
        list.push(task)
      }
    })
    result.forEach(day => {
      day.totalElapsed = day.tasks.reduce((sum, task) => sum + task.elapsed, 0)
      day.tasks.sort((a, b) => a.startedAt <= b.startedAt ? 1 : -1)
    })
    result.sort((a, b) => a.dayDate <= b.dayDate ? 1 : -1)
    return result
  }
)
