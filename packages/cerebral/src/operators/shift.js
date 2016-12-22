export default function (target) {
  if (typeof target !== 'function') {
    throw new Error('Cerebral operator.shift: You have to use a STATE TAG as first argument')
  }

  function shift ({state, input}) {
    const getters = {state: state.get, input}
    const targetTemplate = target(getters)

    if (targetTemplate.target !== 'state') {
      throw new Error('Cerebral operator.shift: You have to use a STATE TAG as first argument')
    }

    state.shift(targetTemplate.path)
  }

  shift.displayName = 'operator.shift'

  return shift
}
