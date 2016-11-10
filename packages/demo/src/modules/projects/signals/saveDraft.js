import {state, unset} from 'cerebral/operators'
import saveDraft from '../actions/saveDraft'

export default [
  saveDraft,
  { success: [unset(state`projects.$draft`)],
    error: []
  }
]
