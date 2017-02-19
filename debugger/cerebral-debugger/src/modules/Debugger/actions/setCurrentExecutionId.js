function setCurrentExecutionId ({props, state}) {
  const expandedSignalGroups = state.get('debugger.expandedSignalGroups')
  const currentSignalExecutionId = state.get('debugger.currentSignalExecutionId')

  state.set('debugger.currentSignalExecutionId', props.executionId)

  if (currentSignalExecutionId !== props.executionId) {
    return
  }

  if (props.groupId && expandedSignalGroups.indexOf(props.groupId) === -1) {
    state.push('debugger.expandedSignalGroups', props.groupId)
  } else if (props.groupId) {
    state.splice('debugger.expandedSignalGroups', expandedSignalGroups.indexOf(props.groupId), 1)
  }
}

export default setCurrentExecutionId
