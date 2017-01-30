function updateRender ({ input, state }) {
  if (input.data.render.components.length) {
    state.unshift('debugger.renders', input.data.render)
    if (state.get('debugger.renders').length > 20) {
      state.pop('debugger.renders')
    }
  }
}

export default updateRender
