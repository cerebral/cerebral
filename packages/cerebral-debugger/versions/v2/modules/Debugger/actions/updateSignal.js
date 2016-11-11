import computedSignalsList from 'common/computed/signalsList';

function updateSignal({input, state}) {
  const signalsList = state.computed(computedSignalsList());
  const execution = input.data.execution
  const signalPath = `debugger.signals.${execution.executionId}`;
  const signal = state.get(signalPath);

  if (signal.functionsRun[execution.functionIndex]) {
    state.push(`${signalPath}.functionsRun.${execution.functionIndex}.data`, execution.data);
  } else {
    state.set(`${signalPath}.functionsRun.${execution.functionIndex}`, {
      payload: execution.payload,
      data: execution.data ? [execution.data] : []
    });
  }
  if (execution.data && execution.data.type === 'mutation') {
    state.push('debugger.mutations',  {
      executionId: execution.executionId,
      data: execution.data
    });
  }
}

export default updateSignal;
