import {set} from 'cerebral/operators'
import {input, state} from 'cerebral/tags'
import Collection from '../../common/Collection'

const collection = Collection('clients', {
  'no-client': {
    key: 'no-client',
    name: 'No client',
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
    phoneClicked: [
      set(state`clients.$phone`, input`phone`)
    ],
    removed: collection.removed,
    routed: [
      set(state`app.$selectedView`, 'Clients')
    ],
    saveClicked: collection.update,
    trashClicked: collection.remove,
    updated: collection.updated,
    uploadProgress: collection.uploadProgress
  }
}
