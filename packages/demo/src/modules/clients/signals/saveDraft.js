import {state, set, unset} from 'cerebral/operators'
import editNextRef from './editNextRef'
import saveDraft from '../actions/saveDraft'

export default [
  unset(state`clients.$showSaveDraftModal`),
  saveDraft, {
    success: [
      unset(state`clients.$draft`),
      ...editNextRef
    ],
    error: [
      set(state`app.$error`)
    ]
  }
]
