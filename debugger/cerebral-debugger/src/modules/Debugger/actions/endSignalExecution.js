function endSignalExecution ({props, state}) {
  const execution = props.data.execution
  const signalPath = `debugger.signals.${execution.executionId}`

  state.set(`${signalPath}.isExecuting`, false)
  state.set('debugger.executingSignalsCount', state.get('debugger.executingSignalsCount') - 1)
}

export default endSignalExecution
