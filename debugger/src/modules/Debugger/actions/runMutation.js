function runMutation ({props, state}) {
  const execution = props.data.execution
  const data = execution.data

  if (data && data.type === 'mutation') {
    try {
      const args = data.args.slice()
      const path = ['debugger', 'model'].concat(args.shift()).join('.')

      state[data.method].apply(null, [path, ...args])
    } catch (e) {
      state.set('mutationsError', {
        signalName: execution.name,
        mutation: data
      })
    }
  }
}

export default runMutation
