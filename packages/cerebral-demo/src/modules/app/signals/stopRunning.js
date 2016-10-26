import {state, unset} from 'cerebral/operators'
import saveRunningTask from '../actions/saveRunningTask'

export default [
  saveRunningTask,
  unset(state`tasks.$running.startedAt`),
  unset(state`tasks.$now`)
]
