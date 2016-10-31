import setInitialPayload from '../actions/setInitialPayload';
import switchType from '../actions/switchType';
import updateSignals from '../actions/updateSignals';
import runMutations from '../actions/runMutations';
import updateComponentsMap from '../actions/updateComponentsMap';
import updateRenders from '../actions/updateRenders';
import setExecutionState from '../actions/setExecutionState';
import runRecordedMutation from '../actions/runRecordedMutation';

export default [
  switchType, {
    init: [setInitialPayload, updateSignals, runMutations],
    execution: [updateSignals, runMutations],
    components: [updateComponentsMap, updateRenders],
    executionChange: [setExecutionState],
    recorderMutation: [runRecordedMutation]
  }
];
