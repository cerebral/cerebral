export default function (target) {
  if (typeof target !== 'function') {
    throw new Error('Cerebral operator.unset: You have to use a STATE TAG as first argument')
  }

  function unset ({state, input}) {
    const getters = {state: state.get, input}
    const targetTemplate = target(getters)

    if (targetTemplate.target !== 'state') {
      throw new Error('Cerebral operator.unset: You have to use a STATE TAG as first argument')
    }

    state.unset(targetTemplate.path)
  }

  unset.displayName = 'operator.unset'

  return unset
}
