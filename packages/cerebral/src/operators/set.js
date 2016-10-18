export default function (fromTemplate, valueTemplate) {
  if (typeof fromTemplate !== 'function') {
    throw new Error('Cerebral operator.set: You have to use a state template tag as first argument')
  }

  function set (context) {
    const from = fromTemplate(context)
    const value = typeof valueTemplate === 'function' ? valueTemplate(context).toValue() : valueTemplate

    if (from.target !== 'state') {
      throw new Error('Cerebral operator.set: You have to use a state template tag as first argument')
    }

    context.state.set(from.path, value)
  }

  set.displayName = 'operator.set'

  return set
}
