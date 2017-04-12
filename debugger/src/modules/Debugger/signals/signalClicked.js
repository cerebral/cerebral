import {set} from 'cerebral/operators'
import {state} from 'cerebral/tags'
import setCurrentExecutionId from '../actions/setCurrentExecutionId'

export default [
  set(state`debugger.currentPage`, 'signals'),
  setCurrentExecutionId
]
