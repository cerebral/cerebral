export default function (target, ...values) {
  if (typeof target !== 'function') {
    throw new Error('Cerebral operator.merge: You have to use the STATE TAG as first argument')
  }

  function merge ({state, input}) {
    const getters = {state: state.get, input}
    const targetTemplate = target(getters)

    if (targetTemplate.target !== 'state') {
      throw new Error('Cerebral operator.merge: You have to use a state TAG as first argument')
    }

    state.merge(targetTemplate.path, ...values.map((value) => {
      if (typeof value === 'function') {
        return value(getters).value
      }

      return Object.keys(value).reduce((currentValue, key) => {
        currentValue[key] = typeof value[key] === 'function' ? value[key](getters).value : value[key]

        return currentValue
      }, {})
    }))
  }

  merge.displayName = 'operator.merge'

  return merge
}
