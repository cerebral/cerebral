function updateSignalPath ({input, state}) {
  const execution = input.data.execution
  const signalPath = `debugger.signals.${execution.executionId}`
  const signal = state.get(signalPath)

  state.set(`${signalPath}.functionsRun.${execution.functionIndex}.path`, execution.path)
}

export default updateSignalPath
