import {state, when} from 'cerebral/operators'
import startRunning from './startRunning'
import stopRunning from './stopRunning'

export default [
  when(state`tasks.$running.startedAt`), {
    true: stopRunning,
    false: startRunning
  }
]
