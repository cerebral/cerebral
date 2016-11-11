function setCurrentExecutionId({input, state}) {
  const debuggerState = state.select('debugger');
  const expandedSignalGroups = debuggerState.get('expandedSignalGroups');
  const currentSignalExecutionId = debuggerState.get('currentSignalExecutionId');

  debuggerState.set(['currentSignalExecutionId'], input.executionId);

  if (currentSignalExecutionId !== input.executionId) {
    return;
  }

  if (input.groupId && expandedSignalGroups.indexOf(input.groupId) === -1) {
    debuggerState.push('expandedSignalGroups', input.groupId);
  } else if (input.groupId) {
    debuggerState.splice('expandedSignalGroups', expandedSignalGroups.indexOf(input.groupId), 1);
  }
}

export default setCurrentExecutionId;
