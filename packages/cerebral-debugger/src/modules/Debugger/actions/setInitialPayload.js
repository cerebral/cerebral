function setInitialPayload ({input, state}) {
  state.set('debugger.initialModel', input.data.initialModel)
  state.set('debugger.model', input.data.initialModel)
  state.set('debugger.signals', {})
  state.set('debugger.mutationsError', false)
  state.set('debugger.renders', [])
  state.set('debugger.currentSignalExecutionId', null)
}

export default setInitialPayload
