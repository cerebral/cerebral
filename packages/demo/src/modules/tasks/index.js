import {set} from 'cerebral/operators'
import {state} from 'cerebral/tags'
import Collection from '../../common/Collection'
import startStopRunning from './signals/startStopRunning'
import updated from './signals/updated'
import updateDraft from './signals/updateDraft'
import updateNow from './signals/updateNow'
import startStopUpdateNow from './signals/startStopUpdateNow'
import tasksInit from './signals/init'

const collection = Collection('tasks')

export const init = tasksInit

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
    routed: [
      set(state`app.$selectedView`, 'Tasks')
    ],
    startStopClicked: startStopRunning,
    timeHasPassed: updateNow,
    updated,
    visibilityChanged: startStopUpdateNow
  }
}
