import {input, set, state} from 'cerebral/operators'
import addClient from './signals/addClient'
import discardDraft from './signals/discardDraft'
import saveDraft from './signals/saveDraft'
import editClient from './signals/editClient'
import removeClient from './signals/removeClient'
import closeDraft from './signals/closeDraft'
import closeModal from './signals/closeModal'
import updateDraft from './signals/updateDraft'
import firebaseItemRemoved from '../../factories/firebaseItemRemoved'
import firebaseItemChanged from '../../factories/firebaseItemChanged'

export default {
  state: {
    all: {},
    $filter: ''
  },
  signals: {
    addClicked: addClient,
    discardClicked: discardDraft,
    enterPressed: saveDraft,
    escPressed: discardDraft,
    filterChanged: [
      set(state`clients.$filter`, input`filter`)
    ],
    filterEnterPressed: addClient,
    formValueChanged: updateDraft,
    formCardClicked: closeDraft,
    phoneClicked: [
      set(state`clients.$phone`, input`phone`)
    ],
    reviewChangesClicked: closeModal,
    routed: [
      set(state`app.$selectedView`, 'Clients')
    ],
    penClicked: editClient,
    trashClicked: removeClient,
    saveClicked: saveDraft,
    clients_ChildAdded: [ firebaseItemChanged('clients.all') ],
    clients_ChildChanged: [ firebaseItemChanged('clients.all') ],
    clients_ChildRemoved: [ firebaseItemRemoved('clients.all') ]
  }
}
