import {input, set, state} from 'cerebral/operators'
import addClient from './signals/addClient'
import discardDraft from './signals/discardDraft'
import saveDraft from './signals/saveDraft'
import editClient from './signals/editClient'
import closeDraft from './signals/closeDraft'
import closeModal from './signals/closeModal'
import updateDraft from './signals/updateDraft'

export default {
  state: {
    all: {
      'cerebral': {
        name: 'Cerebral',
        notes: 'Make sense of complex apps.',
        ref: 'cerebral',
        image: '/img/cerebral-mini.png',
        website: 'cerebraljs.com'
      },
      'calvin': {
        ref: 'calvin',
        name: 'Calvin and Hobbes Ltd',
        email: 'calvin@hobbes.com',
        phone: '123456789'
      },
      'largo': {
        ref: 'largo',
        name: 'Largo Winch et al'
      },
      'no-client': {
        ref: 'no-client',
        name: 'No client'
      }
    },
    $filter: ''
  },
  signals: {
    addClicked: addClient,
    discardClicked: discardDraft,
    cardClicked: editClient,
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
    saveClicked: saveDraft
  }
}
