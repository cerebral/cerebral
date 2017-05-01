function setMutationPath ({props, state}) {
  state.set('debugger.currentMutationPath', props.path)
}

export default setMutationPath
