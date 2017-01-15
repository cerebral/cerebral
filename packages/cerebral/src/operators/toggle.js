export default function (target) {
  function toggle ({state, input, resolveArg}) {
    if (!resolveArg.isTag(target, 'state')) {
      throw new Error('Cerebral operator.toggle: You have to use the STATE TAG as first argument')
    }

    const path = resolveArg.path(target)

    state.set(path, !state.get(path))
  }

  toggle.displayName = 'operator.toggle'

  return toggle
}
