function updateActionError ({props, state}) {
  const execution = props.data.execution
  const signalPath = `debugger.signals.${execution.executionId}`

  state.set(`${signalPath}.functionsRun.${execution.functionIndex}.error`, execution.error)
}

export default updateActionError
