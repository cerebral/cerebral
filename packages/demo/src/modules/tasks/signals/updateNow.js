import {debounce, set, state, when} from 'cerebral/operators'
import now from '../operators/now'

const sharedDebounce = debounce.shared()

const triggerAgain = ({controller}) => {
  // We have to use setTimeout to not trigger signal in signal
  setTimeout(controller.getSignal('tasks.timeHasPassed'))
}

export default [
  set(state`tasks.$now`, now),
  ...sharedDebounce(1000, [
    when(state`tasks.$now`), {
      true: [
        // Still running
        triggerAgain
      ],
      false: [
        // Terminated
      ]
    }
  ])
]
