import { displayElapsed } from '../../helpers/dateTime'

const noDurationString = displayElapsed(0)

export const displayTaskDuration = task => {
  if (task.startedAt) {
    return displayElapsed(task.elapsed)
  } else {
    return noDurationString
  }
}

export const isRunning = task => {
  return task.startedAt && !task.endedAt
}
