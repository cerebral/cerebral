export default function (targetTemplate, valueTemplate) {
  if (typeof targetTemplate !== 'function') {
    throw new Error('Cerebral operator.concat: You have to use a state template tag as first argument')
  }

  function concat (context) {
    const target = targetTemplate(context)
    const value = typeof valueTemplate === 'function' ? valueTemplate(context).toValue() : valueTemplate

    if (target.target !== 'state') {
      throw new Error('Cerebral operator.concat: You have to use a state template tag as first argument')
    }

    context.state.concat(target.path, value)
  }

  concat.displayName = 'operator.concat'

  return concat
}
