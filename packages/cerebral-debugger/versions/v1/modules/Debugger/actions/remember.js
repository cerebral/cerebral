function remember({input, state}) {
  state.set('debugger.model', state.get('debugger.initialModel'))
  state.set('debugger.currentRememberedSignalExecutionId', input.executionId)
  const mutations = state.get('debugger.mutations')
  let lastMutationIndex
  for (lastMutationIndex = mutations.length - 1; lastMutationIndex >= 0; lastMutationIndex--) {
    if (mutations[lastMutationIndex].executionId === input.executionId) {
      break
    }
  }

  for (let x = 0; x <= lastMutationIndex; x++) {
    const mutation = mutations[x].data
    const args = mutation.args.slice()
    const path = args.shift()

    state[mutation.method](['debugger', 'model', ...path], ...args)
  }
}

export default remember;
