function setInitialPayload ({input, state}) {
  state.set('debugger.signals', {})
  state.set('debugger.currentSignalExecutionId', null)
}

export default setInitialPayload
