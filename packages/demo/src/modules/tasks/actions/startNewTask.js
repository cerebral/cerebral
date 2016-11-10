import {now} from '../../../helpers/dateTime'

export default function startNewTask ({state}) {
  const startedAt = now()
  state.set(`tasks.$now`, startedAt)
  state.set(`tasks.$running.startedAt`, startedAt)
}
