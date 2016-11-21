import {set, state} from 'cerebral/operators'
import makeRef from '../../common/operators/makeRef'
import saveDraft from '../actions/saveDraft'

export default [
  set(state`clients.$draft`, {}),
  set(state`clients.$draft.name`, state`clients.$filter`),
  set(state`clients.$draft.ref`, makeRef),
  set(state`clients.$filter`, ''),
  saveDraft, {
    success: [],
    error: []
  }
]
