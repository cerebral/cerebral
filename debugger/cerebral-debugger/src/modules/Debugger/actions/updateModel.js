function updateModel ({input, state}) {
  state.set(['debugger', 'model'].concat(input.path).join('.'), input.value)
}

export default updateModel
