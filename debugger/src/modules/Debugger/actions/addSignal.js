import computedSignalsList from '../../../common/computed/signalsList'

function addSignal ({props, state, resolve}) {
  const signalsList = resolve.value(computedSignalsList)
  const execution = props.data.execution
  const prevSignal = signalsList[signalsList.length - 1]
  const newSignal = {
    name: execution.name,
    executionId: execution.executionId,
    source: props.source,
    isExecuting: true,
    datetime: execution.datetime,
    staticTree: execution.staticTree,
    groupId: prevSignal && prevSignal.name === execution.name ? prevSignal.groupId : execution.name,
    functionsRun: {},
    executedBy: execution.executedBy || null
  }

  if (newSignal.executedBy) {
    state.set(`debugger.executedBySignals.${execution.executionId}`, newSignal)
    state.set(`debugger.signals.${newSignal.executedBy.id}.functionsRun.${newSignal.executedBy.functionIndex}.executedId`, execution.executionId)
  } else {
    state.set(`debugger.signals.${execution.executionId}`, newSignal)
    state.set('debugger.executingSignalsCount', state.get('debugger.executingSignalsCount') + 1)

    const currentSignalExecutionId = state.get('debugger.currentSignalExecutionId')
    if (!signalsList.length || currentSignalExecutionId === signalsList[0].executionId) {
      state.set('debugger.currentSignalExecutionId', execution.executionId)
    }
  }
}

export default addSignal
