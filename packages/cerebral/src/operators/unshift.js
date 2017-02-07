export default function (target, value) {
  function unshift ({state, resolve}) {
    if (!resolve.isTag(target, 'state')) {
      throw new Error('Cerebral operator.unshift: You have to use the STATE TAG as first argument')
    }

    state.unshift(resolve.path(target), resolve.value(value))
  }

  unshift.displayName = `operator.unshift(${String(target)}, ${String(value)})`

  return unshift
}
