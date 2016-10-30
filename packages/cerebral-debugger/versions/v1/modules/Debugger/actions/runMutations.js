function runMutations({input, state}) {
  const updates = input.data.executions;

  updates.forEach(function (update, index) {
    const data = update.data;

    if (data && data.type === 'mutation') {
      try {
        const args = data.args.slice();
        const path = ['debugger', 'model'].concat(args.shift());

        state[data.method].apply(null, [path, ...args]);
      } catch (e) {
        state.set('mutationsError', {
          signalName: update.name,
          mutation: data
        });
      }
    }
  });
}

export default runMutations;
