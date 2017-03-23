function updateActionError ({props, state}) {
  const execution = props.data.execution
  const signalPath = state.get(`debugger.executedBySignals.${execution.executionId}`) ? (
    `debugger.executedBySignals.${execution.executionId}`
  ) : (
    `debugger.signals.${execution.executionId}`
  )

  state.set(`${signalPath}.functionsRun.${execution.functionIndex}.error`, execution.error)
}

export default updateActionError
