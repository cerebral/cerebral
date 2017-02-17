import {compute} from 'cerebral'
import {elapsedSeconds as computeElapsedSeconds} from '../../../helpers/dateTime'

export default function (startedAtTag, endedAtTag) {
  const elapsedSeconds = compute(startedAtTag, endedAtTag, (startedAt, endedAt) => {
    return computeElapsedSeconds(startedAt, endedAt)
  })

  elapsedSeconds.displayName = 'elapsedSeconds'

  return elapsedSeconds
}
