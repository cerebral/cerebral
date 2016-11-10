import startNewTask from '../actions/startNewTask'
import updateNow from './updateNow'

export default [
  startNewTask,
  ...updateNow
]
