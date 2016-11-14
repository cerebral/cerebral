import computedSignalsList from 'common/computed/signalsList';

function addSignal({input, state}) {
  const signalsList = state.compute(computedSignalsList);
  const execution = input.data.execution;
  const prevSignal = signalsList[signalsList.length - 1];
  const newSignal = {
    name: execution.name,
    executionId: execution.executionId,
    isExecuting: true,
    datetime: execution.datetime,
    staticTree: execution.staticTree,
    groupId: prevSignal && prevSignal.name === execution.name ? prevSignal.groupId : execution.name,
    functionsRun: {}
  };
  state.set(`debugger.signals.${execution.executionId}`, newSignal);

  const currentSignalExecutionId = state.get('debugger.currentSignalExecutionId')
  if (!signalsList.length || currentSignalExecutionId === signalsList[0].executionId) {
    state.set('debugger.currentSignalExecutionId', execution.executionId);
    state.set('debugger.currentRememberedSignalExecutionId', execution.executionId);
  }
}

export default addSignal;
