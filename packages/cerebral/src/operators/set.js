export default function (targetTemplate, valueTemplate) {
  if (typeof targetTemplate !== 'function') {
    throw new Error('Cerebral operator.set: You have to use a state template tag as first argument')
  }

  function set (context) {
    const target = targetTemplate(context)
    const value = typeof valueTemplate === 'function' ? valueTemplate(context).toValue() : valueTemplate

    if (target.target !== 'state') {
      throw new Error('Cerebral operator.set: You have to use a state template tag as first argument')
    }

    context.state.set(target.path, value)
  }

  set.displayName = 'operator.set'

  return set
}
