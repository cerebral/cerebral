import updateNow from './updateNow'
import startNewTask from '../../tasks/actions/startNewTask'

export default [
  startNewTask,
  ...updateNow
]
