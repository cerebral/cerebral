export default function (target, value) {
  if (typeof target !== 'function') {
    throw new Error('Cerebral operator.push: You have to use a STATE TAG as first argument')
  }

  function push ({state, input}) {
    const getters = {state: state.get, input}
    const targetTemplate = target(getters)
    const pushValue = typeof value === 'function' ? value(getters).value : value

    if (targetTemplate.target !== 'state') {
      throw new Error('Cerebral operator.push: You have to use a STATE TAG as first argument')
    }

    state.push(targetTemplate.path, pushValue)
  }

  push.displayName = 'operator.push'

  return push
}
