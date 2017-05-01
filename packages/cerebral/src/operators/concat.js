export default function (target, value) {
  function concat ({state, resolve}) {
    if (!resolve.isTag(target, 'state')) {
      throw new Error('Cerebral operator.concat: You have to use the STATE TAG as first argument')
    }

    state.concat(resolve.path(target), resolve.value(value))
  }

  concat.displayName = `operator.concat(${String(target)}, ${String(value)})`

  return concat
}
