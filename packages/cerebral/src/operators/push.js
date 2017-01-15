export default function (target, value) {
  function push ({state, input, resolve}) {
    if (!resolve.isTag(target, 'state')) {
      throw new Error('Cerebral operator.push: You have to use the STATE TAG as first argument')
    }

    state.push(resolve.path(target), resolve.value(value))
  }

  push.displayName = `operator.push(${String(target)})`

  return push
}
