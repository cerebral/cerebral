export default function (target) {
  function unset ({state, input, resolveArg}) {
    if (!resolveArg.isTag(target, 'state')) {
      throw new Error('Cerebral operator.unset: You have to use the STATE TAG as first argument')
    }

    state.unset(resolveArg.path(target))
  }

  unset.displayName = 'operator.unset'

  return unset
}
