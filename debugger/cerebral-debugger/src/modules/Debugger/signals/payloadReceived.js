import setInitialPayload from '../actions/setInitialPayload'
import switchType from '../actions/switchType'
import addSignal from '../actions/addSignal'
import updateSignal from '../actions/updateSignal'
import updateSignalPath from '../actions/updateSignalPath'
import endSignalExecution from '../actions/endSignalExecution'
import runMutation from '../actions/runMutation'
import updateComponentsMap from '../actions/updateComponentsMap'
import updateRenders from '../actions/updateRenders'
import runRecordedMutation from '../actions/runRecordedMutation'
import updateActionOutput from '../actions/updateActionOutput'
import updateActionError from '../actions/updateActionError'
import parseAndRunMessages from '../actions/parseAndRunMessages'

export default [
  switchType, {
    init: [setInitialPayload],
    bulk: [parseAndRunMessages],
    executionStart: [addSignal],
    execution: [updateSignal, runMutation],
    executionFunctionEnd: [updateActionOutput],
    executionPathStart: [updateSignalPath],
    executionEnd: [endSignalExecution],
    executionFunctionError: [updateActionError],
    components: [updateComponentsMap, updateRenders],
    recorderMutation: [runRecordedMutation]
  }
]
