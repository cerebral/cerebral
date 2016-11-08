import {set, state} from 'cerebral/operators'
import makeRef from '../../common/operators/makeRef'
import saveDraft from '../actions/saveDraft'

export default [
  set(state`projects.$draft`, {}),
  set(state`projects.$draft.name`, state`projects.$filter`),
  set(state`projects.$draft.clientRef`, 'no-client'),
  set(state`projects.$draft.ref`, makeRef),
  saveDraft, {
    success: [],
    error: []
  }
]
