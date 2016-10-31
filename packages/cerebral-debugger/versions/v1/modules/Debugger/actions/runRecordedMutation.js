function runRecordedMutation({input, state}) {
  const args = input.data.args
  const path = ['debugger', 'model'].concat(input.data.path);

  state.set.apply(null, [path, ...args]);
}

export default runRecordedMutation
