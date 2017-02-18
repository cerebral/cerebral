function clean ({state}) {
  state.set('debugger.signals', {})
  state.set('debugger.mutationsError', false)
  state.set('debugger.mutations', [])
  state.set('debugger.renders', [])
  state.set('debugger.currentRememberedMutationIndex', 0)
  state.set('debugger.executingSignalsCount', 0)
}

export default clean
