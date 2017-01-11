import {debounce, set, when} from 'cerebral/operators'
import {input, state} from 'cerebral/tags'
import setNow from '../actions/setNow'

const triggerAgain = ({controller}) => {
  // We have to use setTimeout to not trigger signal in signal
  setTimeout(controller.getSignal('tasks.timeHasPassed'))
}

export default [
  setNow,
  set(state`tasks.$now`, input`now`),
  debounce(1000), {
    continue: [
      when(state`tasks.$now`, state`tasks.$nowHidden`,
        (now, hidden) => now && !hidden
      ), {
        true: [
          // Still running
          triggerAgain
        ],
        false: [
          // Terminated or hidden
        ]
      }
    ],
    discard: []
  }
]
