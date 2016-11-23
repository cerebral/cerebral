import {input, set, state} from 'cerebral/operators'
import Collection from '../common/Collection'

import closeProjectSelector from './signals/closeProjectSelector'

const collection = Collection('projects', {
  'no-project': {
    ref: 'no-project',
    name: 'no project',
    clientKey: 'no-client',
    $isDefaultItem: true
  }
})

export const init = collection.init

export default {
  state: {
    all: {},
    $filter: ''
  },
  signals: {
    addClicked: collection.create,
    discardClicked: collection.discardDraft,
    enterPressed: collection.update,
    escPressed: collection.discardDraft,
    filterChanged: collection.updateFilter,
    filterEnterPressed: collection.create,
    formValueChanged: collection.updateDraft,
    penClicked: collection.edit,
    projectTagClicked: [
      set(state`projects.$showProjectSelector`, true)
    ],
    removed: collection.removed,
    routed: [
      set(state`app.$selectedView`, 'Projects')
    ],
    saveClicked: collection.update,
    selectorBackgroundClick: closeProjectSelector,
    selectorProjectClicked: [
      set(state`tasks.$running.projectKey`, input`ref`),
      ...closeProjectSelector
    ],
    trashClicked: collection.remove,
    updated: collection.updated
  }
}
