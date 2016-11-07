export default function (targetTemplate, valueTemplate) {
  if (typeof targetTemplate !== 'function') {
    throw new Error('Cerebral operator.merge: You have to use a state template tag as first argument')
  }

  function merge (context) {
    const target = targetTemplate(context)
    const value = typeof valueTemplate === 'function' ? valueTemplate(context).toValue() : valueTemplate

    if (target.target !== 'state') {
      throw new Error('Cerebral operator.merge: You have to use a state template tag as first argument')
    }

    context.state.merge(target.path, Object.keys(value).reduce((currentValue, key) => {
      currentValue[key] = typeof value[key] === 'function' ? value[key](context).toValue() : value[key]

      return currentValue
    }, {}))
  }

  merge.displayName = 'operator.merge'

  return merge
}
