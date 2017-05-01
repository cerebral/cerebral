function updateRender ({ props, state }) {
  if (props.data.render.components.length) {
    state.unshift('debugger.renders', props.data.render)
    if (state.get('debugger.renders').length > 20) {
      state.pop('debugger.renders')
    }
  }
}

export default updateRender
