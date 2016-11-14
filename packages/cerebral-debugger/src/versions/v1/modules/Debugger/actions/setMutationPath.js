function setMutationPath({input, state}) {
  state.set('debugger.currentMutationPath', input.path);
}

export default setMutationPath;
