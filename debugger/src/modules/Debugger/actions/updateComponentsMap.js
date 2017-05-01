function updateComponentsMap ({ props, state }) {
  state.set('debugger.componentsMap', props.data.map)
}

export default updateComponentsMap
