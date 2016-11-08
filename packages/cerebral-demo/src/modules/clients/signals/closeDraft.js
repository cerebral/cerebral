import {set, state} from 'cerebral/operators'
import draftChanged from '../actions/draftChanged'
import discardDraft from './discardDraft'

export default [
  draftChanged, {
    true: [
      set(state`clients.$showSaveDraftModal`, true)
    ],
    false: discardDraft
  }
]
