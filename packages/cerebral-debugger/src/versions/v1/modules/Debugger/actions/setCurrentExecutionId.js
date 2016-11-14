function setCurrentExecutionId({input, state}) {
  const expandedSignalGroups = state.get('debugger.expandedSignalGroups');
  const currentSignalExecutionId = state.get('debugger.currentSignalExecutionId');

  state.set('debugger.currentSignalExecutionId', input.executionId);

  if (currentSignalExecutionId !== input.executionId) {
    return;
  }

  if (input.groupId && expandedSignalGroups.indexOf(input.groupId) === -1) {
    state.push('debugger.expandedSignalGroups', input.groupId);
  } else if (input.groupId) {
    state.splice('debugger.expandedSignalGroups', expandedSignalGroups.indexOf(input.groupId), 1);
  }
}

export default setCurrentExecutionId;
