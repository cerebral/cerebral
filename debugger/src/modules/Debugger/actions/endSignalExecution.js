function endSignalExecution ({props, state}) {
  const type = state.get('type')
  const execution = props.data.execution
  const signalPath = state.get(`debugger.executedBySignals.${execution.executionId}`) ? (
    `debugger.executedBySignals.${execution.executionId}`
  ) : (
    `debugger.signals.${execution.executionId}`
  )

  state.set(`${signalPath}.isExecuting`, false)
  if (
    (props.source === 'c' && (type === 'c' || type === 'cft')) ||
    (props.source === 'ft' && type === 'ft')
  ) {
    state.set('debugger.executingSignalsCount', state.get('debugger.executingSignalsCount') - 1)
  }
}

export default endSignalExecution
