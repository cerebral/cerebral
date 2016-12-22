export default function (target, value) {
  if (typeof target !== 'function') {
    throw new Error('Cerebral operator.set: You have to use a STATE TAG as first argument')
  }

  function unshift ({state, input}) {
    const getters = {state: state.get, input}
    const targetTemplate = target(getters)
    const unshiftValue = typeof value === 'function' ? value(getters).value : value

    if (targetTemplate.target !== 'state') {
      throw new Error('Cerebral operator.unshift: You have to use a STATE TAG as first argument')
    }

    state.unshift(targetTemplate.path, unshiftValue)
  }

  unshift.displayName = 'operator.unshift'

  return unshift
}
