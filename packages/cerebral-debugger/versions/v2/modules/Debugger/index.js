import pageChanged from './signals/pageChanged';
import signalClicked from './signals/signalClicked';
import payloadReceived from './signals/payloadReceived';
import modelChanged from './signals/modelChanged';
import signalDoubleClicked from './signals/signalDoubleClicked';
import mutationClicked from './signals/mutationClicked';
import resetClicked from './signals/resetClicked';
import modelClicked from './signals/modelClicked';

export default (module) => {

  module.addState({
    settings: {},
    initialModel: {},
    isExecuting: false,
    model: {},
    currentPage: 'signals',
    lastMutationCount: 0,
    currentSignalExecutionId: null,
    currentRememberedSignalExecutionId: null,
    signals: {},
    mutations: [],
    expandedSignalGroups: [],
    currentMutationPath: null,
    componentsMap: {},
    renders: [],
    mutationsError: false
  });

  module.addSignals({
    pageChanged,
    signalClicked,
    payloadReceived,
    modelChanged,
    signalDoubleClicked,
    mutationClicked,
    resetClicked,
    modelClicked
  });

};
