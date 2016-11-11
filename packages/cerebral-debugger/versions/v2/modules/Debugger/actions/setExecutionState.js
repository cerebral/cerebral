function setExecutionState({input, state}) {
  state.set('debugger.isExecuting', input.data.isExecuting);
}

export default setExecutionState;
