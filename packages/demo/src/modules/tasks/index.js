import {input, set, state} from 'cerebral/operators'
import Collection from '../common/Collection'
import startStopRunning from './signals/startStopRunning'
import updateNow from './signals/updateNow'

const collection = Collection('tasks')

export const init = collection.init

export default {
  state: {
    all: {},
    $running: {
      projectKey: 'no-project'
    }
  },
  signals: {
    enterPressed: startStopRunning,
    runningInputChanged: [
      set(state`tasks.$running.description`, input`description`)
    ],
    routed: [
      set(state`app.$selectedView`, 'Tasks')
    ],
    startStopClicked: startStopRunning,
    timeHasPassed: updateNow
  }
}
