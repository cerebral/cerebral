function runRecordedMutation ({props, state}) {
  const args = props.data.args
  const path = ['debugger', 'model'].concat(props.data.path).join('.')

  state.set.apply(null, [path, ...args])
}

export default runRecordedMutation
