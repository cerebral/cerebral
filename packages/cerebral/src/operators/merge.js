export default function (target, ...values) {
  if (typeof target !== 'function') {
    throw new Error('Cerebral operator.merge: You have to use a state template tag as first argument')
  }

  function merge (context) {
    const targetTemplate = target(context)

    if (targetTemplate.target !== 'state') {
      throw new Error('Cerebral operator.merge: You have to use a state template tag as first argument')
    }

    context.state.merge(targetTemplate.path, ...values.map((value) => {
      if (typeof value === 'function') {
        return value(context).value
      }

      return Object.keys(value).reduce((currentValue, key) => {
        currentValue[key] = typeof value[key] === 'function' ? value[key](context).value : value[key]

        return currentValue
      }, {})
    }))
  }

  merge.displayName = 'operator.merge'

  return merge
}
