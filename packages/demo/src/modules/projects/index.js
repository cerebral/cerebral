import {input, set, state} from 'cerebral/operators'
import addProject from './signals/addProject'
import closeProjectSelector from './signals/closeProjectSelector'
import discardDraft from './signals/discardDraft'
import editProject from './signals/editProject'
import updateDraft from './signals/updateDraft'
import saveDraft from './signals/saveDraft'
import firebaseItemChanged from '../../factories/firebaseItemChanged'
import firebaseItemRemoved from '../../factories/firebaseItemRemoved'

export default {
  state: {
    all: {},
    $filter: ''
  },
  signals: {
    addClicked: addProject,
    cancelClicked: discardDraft,
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
    ],
    projects_ChildAdded: [firebaseItemChanged('projects.all')],
    projects_ChildChanged: [firebaseItemChanged('projects.all')],
    projects_ChildRemoved: [firebaseItemRemoved('projects.all')]
  }
}
