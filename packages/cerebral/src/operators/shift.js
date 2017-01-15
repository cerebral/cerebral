export default function (target) {
  function shift ({state, input, resolve}) {
    if (!resolve.isTag(target, 'state')) {
      throw new Error('Cerebral operator.shift: You have to use the STATE TAG as first argument')
    }

    state.shift(resolve.path(target))
  }

  shift.displayName = `operator.shift(${String(target)})`

  return shift
}
