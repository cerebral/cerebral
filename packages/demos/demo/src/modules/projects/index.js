import {set} from 'cerebral/operators'
import {state} from 'cerebral/tags'
import Collection from '../../common/Collection'

import projectSelectorClose from './signals/projectSelectorClose'
import projectSelectorSelect from './signals/projectSelectorSelect'

const collection = Collection('projects', {
  'no-project': {
    key: 'no-project',
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
    addClicked: collection.newItem,
    discardClicked: collection.discardDraft,
    enterPressed: collection.update,
    escPressed: collection.discardDraft,
    filterChanged: collection.updateFilter,
    filterEnterPressed: collection.newItem,
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
    selectorBackgroundClick: projectSelectorClose,
    selectorProjectClicked: projectSelectorSelect,
    trashClicked: collection.remove,
    updated: collection.updated
  }
}
