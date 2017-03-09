function updateModel ({props, state}) {
  state.set(['debugger', 'model'].concat(props.path).join('.'), props.value)
}

export default updateModel
