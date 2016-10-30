function setMutationPath({input, state}) {
  const debuggerState = state.select('debugger');
  debuggerState.set(['currentMutationPath'], input.path);
}

export default setMutationPath;
