import {input, set, state} from 'cerebral/operators'
import startStopRunning from './signals/startStopRunning'
import updateNow from './signals/updateNow'

export default {
  state: {
    all: {},
    $running: {
      projectRef: 'no-project'
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
