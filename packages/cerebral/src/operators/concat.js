export default function (target, value) {
  if (typeof target !== 'function') {
    throw new Error('Cerebral operator.concat: You have to use the STATE TAG as first argument')
  }

  function concat ({state, input}) {
    const getters = {state: state.get, input}
    const targetTemplate = target(getters)
    const concatValue = typeof value === 'function' ? value(getters).value : value

    if (targetTemplate.target !== 'state') {
      throw new Error('Cerebral operator.concat: You have to use a state template tag as first argument')
    }

    state.concat(targetTemplate.path, concatValue)
  }

  concat.displayName = 'operator.concat'

  return concat
}
