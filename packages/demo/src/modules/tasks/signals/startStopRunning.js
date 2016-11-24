import {state, when} from 'cerebral/operators'
import startRunning from './startRunning'
import stopRunning from './stopRunning'

export default [
  when(state`tasks.$draft.startedAt`), {
    true: stopRunning('tasks'),
    false: startRunning('tasks')
  }
]
