export default function (target, value) {
  if (typeof target !== 'function') {
    throw new Error('Cerebral operator.set: You have to use a STATE TAG as first argument')
  }

  function set ({state, input}) {
    const getters = {state: state.get, input}
    const targetTemplate = target(getters)
    const setValue = typeof value === 'function' ? value(getters).value : value

    if (targetTemplate.target !== 'state' && targetTemplate.target !== 'input') {
      throw new Error('Cerebral operator.set: You have to use a STATE or INPUT TAG as first argument')
    }

    if (targetTemplate.target === 'state') {
      state.set(targetTemplate.path, setValue)
    } else {
      const result = Object.assign({}, input)
      const parts = targetTemplate.path.split('.')
      const key = parts.pop()
      const target = parts.reduce((target, key) => {
        return (target[key] = Object.assign({}, target[key] || {}))
      }, result)
      target[key] = setValue

      return result
    }
  }

  set.displayName = 'operator.set'

  return set
}
