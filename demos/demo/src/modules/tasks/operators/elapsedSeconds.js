import {elapsedSeconds as computeElapsedSeconds} from '../../../helpers/dateTime'

export default function (startedAtTag, endedAtTag) {
  function elapsedSeconds (context) {
    const startedAt = typeof startedAtTag === 'function'
      ? startedAtTag(context).value : startedAtTag
    const endedAt = typeof endedAtTag === 'function'
      ? endedAtTag(context).value : endedAtTag

    return {value: computeElapsedSeconds(startedAt, endedAt)}
  }

  elapsedSeconds.displayName = 'elapsedSeconds'

  return elapsedSeconds
}
