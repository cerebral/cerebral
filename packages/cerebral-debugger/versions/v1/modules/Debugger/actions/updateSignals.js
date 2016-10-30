import computedSignalsList from 'common/computed/signalsList';

function updateSignals({input, state}) {
  const signalsList = state.computed(computedSignalsList());
  let prevSignal = signalsList[signalsList.length - 1];

  input.data.executions.forEach(update => {
    const signalPath = `debugger.signals.${update.executionId}`;
    const signal = state.get(signalPath);

    if (!signal) {
      const newSignal = prevSignal = {
        name: update.name,
        executionId: update.executionId,
        datetime: update.datetime,
        staticTree: update.staticTree,
        groupId: prevSignal && prevSignal.name === update.name ? prevSignal.groupId : update.name,
        functionsRun: {
          '0': {
            payload: update.payload,
            data: update.data || []
          }
        }
      };
      state.set(`debugger.signals.${update.executionId}`, newSignal);
    } else if (signal.functionsRun[update.functionIndex]) {
      state.push(`${signalPath}.functionsRun.${update.functionIndex}.data`, update.data);
    } else {
      state.set(`${signalPath}.functionsRun.${update.functionIndex}`, {
        payload: update.payload,
        data: update.data ? [update.data] : []
      });
    }
    if (update.data && update.data.type === 'mutation') {
      state.push('debugger.mutations',  {
        executionId: update.executionId,
        data: update.data
      });
    }
  });

  const currentSignalExecutionId = state.get('debugger.currentSignalExecutionId')
  if (!signalsList.length || currentSignalExecutionId === signalsList[0].executionId) {
    const newSignalExecutionId = (
      input.data.executions.length ?
        input.data.executions[input.data.executions.length - 1].executionId
      :
        currentSignalExecutionId
    )
    state.set('debugger.currentSignalExecutionId', newSignalExecutionId);
    state.set('debugger.currentRememberedSignalExecutionId', newSignalExecutionId);
  }
}

export default updateSignals;
