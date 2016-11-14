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

export default [
  switchType, {
    init: [setInitialPayload],
    executionStart: [addSignal],
    execution: [updateSignal, runMutation],
    executionPathStart: [updateSignalPath],
    executionEnd: [endSignalExecution],
    components: [updateComponentsMap, updateRenders],
    recorderMutation: [runRecordedMutation]
  }
]
