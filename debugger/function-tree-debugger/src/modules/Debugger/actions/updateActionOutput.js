function updateActionOutput ({input, state}) {
  const execution = input.data.execution
  const signalPath = `debugger.signals.${execution.executionId}`

  state.set(`${signalPath}.functionsRun.${execution.functionIndex}.output`, execution.output)
}

export default updateActionOutput
