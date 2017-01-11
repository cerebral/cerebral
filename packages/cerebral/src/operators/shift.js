export default function (target) {
  function shift ({state, input, resolveArg}) {
    if (!resolveArg.isTag(target, 'state')) {
      throw new Error('Cerebral operator.shift: You have to use the STATE TAG as first argument')
    }

    state.shift(resolveArg.path(target))
  }

  shift.displayName = 'operator.shift'

  return shift
}
