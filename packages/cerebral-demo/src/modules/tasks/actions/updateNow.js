import {now} from '../../../helpers/dateTime'

export default function updateNow ({state, controller}) {
  state.set(`tasks.$now`, now())

  setTimeout(() => {
    if (state.get(`tasks.$now`)) {
      // Still running.
      controller.getSignal('tasks.timeHasPassed')()
    }
  // 1s interval gives a feel of regularity even if once in a while the display skips a value due to drift (goes from 11 to 13 for example). This is better then the reverse (waiting nearly two seconds for a display change).
  }, 1000)
}
