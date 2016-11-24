import {set, state} from 'cerebral/operators'
import Collection from '../common/Collection'
import startStopRunning from './signals/startStopRunning'
import updated from './signals/updated'
import updateDraft from './signals/updateDraft'
import updateNow from './signals/updateNow'

const collection = Collection('tasks')

export const init = collection.init

export default {
  state: {
    all: {},
    $draft: {
      key: 'running',
      projectKey: 'no-project'
    }
  },
  signals: {
    enterPressed: startStopRunning,
    formValueChanged: updateDraft,
    removed: collection.removed,
    runningInputChanged: updateDraft,
    routed: [
      set(state`app.$selectedView`, 'Tasks')
    ],
    startStopClicked: startStopRunning,
    timeHasPassed: updateNow,
    updated
  }
}
