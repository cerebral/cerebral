function updateActionError ({input, state}) {
  const execution = input.data.execution
  const signalPath = `debugger.signals.${execution.executionId}`

  state.set(`${signalPath}.functionsRun.${execution.functionIndex}.error`, execution.error)
}

export default updateActionError
