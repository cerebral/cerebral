import { debounce, set, when } from 'cerebral/operators'
import { state } from 'cerebral/tags'
import now from '../compute/now'

const triggerAgain = ({ controller }) => {
  // We have to use setTimeout to not trigger signal in signal
  setTimeout(controller.getSignal('tasks.timeHasPassed'))
}

export default [
  set(state`tasks.$now`, now),
  debounce(1000),
  {
    continue: [
      when(
        state`tasks.$now`,
        state`tasks.$nowHidden`,
        (now, hidden) => now && !hidden
      ),
      {
        true: [
          // Still running
          triggerAgain,
        ],
        false: [
          // Terminated or hidden
        ],
      },
    ],
    discard: [],
  },
]
