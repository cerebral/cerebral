import {Tag} from 'cerebral/tags'
import {elapsedSeconds as computeElapsedSeconds} from '../../../helpers/dateTime'

export default function setElapsedSeconds (startedAtTag, endedAtTag) {
  function elapsedSeconds ({state, input}) {
    const getters = {state: state.get, input}
    const startedAt = startedAtTag instanceof Tag
      ? startedAtTag.getValue(getters) : startedAtTag
    const endedAt = endedAtTag instanceof Tag
      ? endedAtTag.getValue(getters) : endedAtTag

    return {elapsedSeconds: computeElapsedSeconds(startedAt, endedAt)}
  }

  elapsedSeconds.displayName = 'elapsedSeconds'

  return elapsedSeconds
}
