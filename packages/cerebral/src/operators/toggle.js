export default function (target) {
  function toggle ({state, input, resolve}) {
    if (!resolve.isTag(target, 'state')) {
      throw new Error('Cerebral operator.toggle: You have to use the STATE TAG as first argument')
    }

    const path = resolve.path(target)

    state.set(path, !state.get(path))
  }

  toggle.displayName = `operator.toggle(${String(target)})`

  return toggle
}
