import {Computed} from 'cerebral'
import {elapsedSeconds, sortDayString} from '../helpers/dateTime'

export default Computed(
  {
    now: 'tasks.$now',
    tasks: 'tasks.all.**'
  },
  ({now, tasks}) => {
    const days = {}
    const result = []
    Object.keys(tasks).forEach(key => {
      const task = tasks[key]
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
      list.push(task)
    })
    result.forEach(day => {
      day.totalElapsed = day.tasks.reduce((sum, t) => (
        sum + (
          typeof t.elapsed === 'number'
            ? t.elapsed
            : elapsedSeconds(t.startedAt, now)
        )
      ), 0)
      day.tasks.sort((a, b) => a.startedAt <= b.startedAt ? 1 : -1)
    })
    result.sort((a, b) => a.dayDate <= b.dayDate ? 1 : -1)
    return result
  }
)
