function reset ({state}) {
  state.merge('debugger', {
    isExecuting: false,
    currentPage: 'signals',
    lastMutationCount: 0,
    currentSignalExecutionId: null,
    currentRememberedSignalExecutionId: null,
    expandedSignalGroups: [],
    currentMutationPath: null,
    mutationsError: false
  })
  // Do update correctly
  state.set('debugger.signals', {})
  state.set('debugger.mutations', [])
  state.set('debugger.model', state.get('debugger.initialModel'))
}

export default reset
