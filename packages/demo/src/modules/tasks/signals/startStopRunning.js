import {state, when} from 'cerebral/operators'
import startRunning from './startRunning'
import stopRunning from './stopRunning'
import {isRunning} from '../../../helpers/task'

export default [
  when(state`tasks.$draft`, isRunning), {
    true: stopRunning('tasks'),
    false: startRunning('tasks')
  }
]
