function endSignalExecution({input, state}) {
  const execution = input.data.execution
  const signalPath = `debugger.signals.${execution.executionId}`;

  state.set(`${signalPath}.isExecuting`, false);
}

export default endSignalExecution;
