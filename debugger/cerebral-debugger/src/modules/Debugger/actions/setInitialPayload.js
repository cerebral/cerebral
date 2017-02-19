function setInitialPayload ({props, state}) {
  state.set('debugger.initialModel', props.data.initialModel)
  state.set('debugger.model', props.data.initialModel)
}

export default setInitialPayload
