export default function (target) {
  if (typeof target !== 'function') {
    throw new Error('Cerebral operator.toggle: You have to use a STATE TAG as first argument')
  }

  function toggle ({state, input}) {
    const getters = {state: state.get, input}
    const targetTemplate = target(getters)

    if (targetTemplate.target !== 'state') {
      throw new Error('Cerebral operator.toggle: You have to use a STATE TAG as first argument')
    }

    state.set(targetTemplate.path, !state.get(targetTemplate.path))
  }

  toggle.displayName = 'operator.toggle'

  return toggle
}
