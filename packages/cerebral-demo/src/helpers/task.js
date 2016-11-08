import {displayElapsed} from './dateTime'

const noDurationString = displayElapsed(0)

export const displayTaskDuration = (task) => {
  if (task.startedAt) {
    return displayElapsed(task.elapsed)
  } else {
    return noDurationString
  }
}
