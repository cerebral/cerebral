function setInitialPayload ({props, state}) {
  if (props.source === 'c') {
    state.set('debugger.initialModel', props.data.initialModel)
    state.set('debugger.model', props.data.initialModel)
  }
}

export default setInitialPayload
