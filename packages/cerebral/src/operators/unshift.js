export default function (target, value) {
  function unshift ({state, input, resolveArg}) {
    if (!resolveArg.isTag(target, 'state')) {
      throw new Error('Cerebral operator.unshift: You have to use the STATE TAG as first argument')
    }

    state.unshift(resolveArg.path(target), resolveArg.value(value))
  }

  unshift.displayName = 'operator.unshift'

  return unshift
}
