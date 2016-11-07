import { showToast } from '../app/actions'
import { myAction1, myAction2, myAction3 } from './actions'
import { state, set, input } from 'cerebral/operators'

export default {
  state: { title: 'Hello from Cerebral!',
    appTitle: 'Cerebral Tutorial App',
    originalValue: '',
    extendedValue: ''
  },
  signals: {
    buttonClicked: [
      ...showToast('Button clicked!', 1000)
    ],
    saveButtonClicked: [
      set(state`sas.originalValue`, input`value`),
      myAction1,
      myAction2,
      myAction3,
      set(state`sas.extendedValue`, input`value`),
      ...showToast()
    ]
  },
  modules: {}
}
