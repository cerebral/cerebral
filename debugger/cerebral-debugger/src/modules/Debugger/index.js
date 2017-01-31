import pageChanged from './signals/pageChanged'
import signalClicked from './signals/signalClicked'
import payloadReceived from './signals/payloadReceived'
import modelChanged from './signals/modelChanged'
import signalDoubleClicked from './signals/signalDoubleClicked'
import mutationClicked from './signals/mutationClicked'
import resetClicked from './signals/resetClicked'
import modelClicked from './signals/modelClicked'
import searchValueChanged from './signals/searchValueChanged'
import escPressed from './signals/escPressed'

export default {
  state: {
    settings: {},
    initialModel: {},
    executingSignalsCount: 0,
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
    mutationsError: false,
    searchValue: '',
    isCatchingUp: false
  },
  signals: {
    pageChanged,
    escPressed,
    searchValueChanged,
    signalClicked,
    payloadReceived,
    modelChanged,
    signalDoubleClicked,
    mutationClicked,
    resetClicked,
    modelClicked
  }
}
