function clean ({props, state}) {
  const debuggerType = state.get('type')
  const messageSource = props.source

  if (
    (debuggerType === 'c' && messageSource === 'c') ||
    (debuggerType === 'ft' && messageSource === 'ft') ||
    (debuggerType === 'cft' && messageSource === 'c')
  ) {
    state.set('debugger.signals', {})
    state.set('debugger.mutationsError', false)
    state.set('debugger.mutations', [])
    state.set('debugger.renders', [])
    state.set('debugger.currentRememberedMutationIndex', 0)
    state.set('debugger.executingSignalsCount', 0)
    state.set('debugger.executedBySignals', {})
  }
}

export default clean
