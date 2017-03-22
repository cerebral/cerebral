function endSignalExecution ({props, state}) {
  const type = state.get('type')
  const execution = props.data.execution
  const executedBySignal = state.get(`debugger.executedBySignals.${execution.executionId}`)

  if (executedBySignal) {
    state.set(`debugger.executedBySignals.${execution.executionId}.isExecuting`, false)
    state.set(`debugger.signals.${executedBySignal.executedBy.id}.isExecuting`, false)
  } else {
    state.set(`debugger.signals.${execution.executionId}.isExecuting`, false)
  }

  if (
    (props.source === 'c' && (type === 'c' || type === 'cft')) ||
    (props.source === 'ft' && type === 'ft')
  ) {
    state.set('debugger.executingSignalsCount', state.get('debugger.executingSignalsCount') - 1)
  }
}

export default endSignalExecution
