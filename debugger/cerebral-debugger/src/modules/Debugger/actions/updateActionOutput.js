function updateActionOutput ({props, state}) {
  const execution = props.data.execution
  const signalPath = `debugger.signals.${execution.executionId}`

  state.set(`${signalPath}.functionsRun.${execution.functionIndex}.output`, execution.output)
}

export default updateActionOutput
