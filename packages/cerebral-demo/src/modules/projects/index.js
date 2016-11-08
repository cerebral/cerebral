import {input, set, state} from 'cerebral/operators'
import addProject from './signals/addProject'
import closeProjectSelector from './signals/closeProjectSelector'
import discardDraft from './signals/discardDraft'
import editProject from './signals/editProject'
import updateDraft from './signals/updateDraft'
import saveDraft from './signals/saveDraft'

export default {
  state: {
    all: {
      'no-project': {
        ref: 'no-project',
        name: 'no project',
        clientRef: 'no-client'
      },
      'cerebral-demo': {
        ref: 'cerebral-demo',
        name: 'Cerebral demo',
        clientRef: 'cerebral'
      },
      'learn-inferno': {
        ref: 'learn-inferno',
        name: 'Learn Inferno',
        clientRef: 'no-client'
      },
      'read-calvin': {
        ref: 'read-calvin',
        name: 'Read Calvin',
        clientRef: 'calvin'
      }
    },
    $filter: ''
  },
  signals: {
    addClicked: addProject,
    cancelClicked: discardDraft,
    cardClicked: editProject,
    enterPressed: saveDraft,
    escPressed: discardDraft,
    formValueChanged: updateDraft,
    filterChanged: [
      set(state`projects.$filter`, input`filter`)
    ],
    filterEnterPressed: addProject,
    penClicked: editProject,
    projectTagClicked: [
      set(state`projects.$showProjectSelector`, true)
    ],
    routed: [
      set(state`app.$selectedView`, 'Projects')
    ],
    saveClicked: saveDraft,
    selectorBackgroundClick: closeProjectSelector,
    selectorProjectClicked: [
      set(state`tasks.$running.projectRef`, input`ref`),
      ...closeProjectSelector
    ]
  }
}
