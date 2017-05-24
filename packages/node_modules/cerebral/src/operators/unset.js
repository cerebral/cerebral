export default function (target) {
  function unset ({state, resolve}) {
    if (!resolve.isTag(target, 'state')) {
      throw new Error('Cerebral operator.unset: You have to use the STATE TAG as first argument')
    }

    state.unset(resolve.path(target))
  }

  unset.displayName = `operator.unset(${String(target)})`

  return unset
}
