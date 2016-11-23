export default function (target, value) {
  if (typeof target !== 'function') {
    throw new Error('Cerebral operator.set: You have to use a state template tag as first argument')
  }

  function set (context) {
    const targetTemplate = target(context)
    const setValue = typeof value === 'function' ? value(context).value : value

    if (targetTemplate.target !== 'state' && targetTemplate.target !== 'input') {
      throw new Error('Cerebral operator.set: You have to use a state or input operator tag as first argument')
    }

    if (targetTemplate.target === 'state') {
      context.state.set(targetTemplate.path, setValue)
    } else {
      const result = Object.assign({}, context.input)
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
