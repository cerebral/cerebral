import {state, when} from 'cerebral/operators'
import paths from '../../../common/Collection/paths'
import {isRunning} from '../helpers'
import startRunning from './startRunning'
import stopRunning from './stopRunning'

const {draftPath} = paths('tasks')

export default [
  when(state`${draftPath}`, isRunning), {
    true: stopRunning,
    false: startRunning
  }
]
