function updateSignalPath ({props, state}) {
  const execution = props.data.execution
  const signalPath = `debugger.signals.${execution.executionId}`

  state.set(`${signalPath}.functionsRun.${execution.functionIndex}.path`, execution.path)
}

export default updateSignalPath
