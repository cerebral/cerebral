function remember ({props, state}) {
  state.set('debugger.model', state.get('debugger.initialModel'))
  state.set('debugger.currentRememberedMutationIndex', props.index)
  const mutations = state.get('debugger.mutations')
  let lastMutationIndex = props.index

  for (let x = mutations.length - 1; x >= lastMutationIndex; x--) {
    const mutation = mutations[x].data
    const args = mutation.args.slice()
    const path = args.shift()

    state[mutation.method](['debugger', 'model', ...path].join('.'), ...args)
  }
}

export default remember
