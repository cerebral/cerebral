export default function (targetTemplate, valueTemplate) {
  if (typeof targetTemplate !== 'function') {
    throw new Error('Cerebral operator.push: You have to use a state template tag as first argument')
  }

  function push (context) {
    const target = targetTemplate(context)
    const value = typeof valueTemplate === 'function' ? valueTemplate(context).toValue() : valueTemplate

    if (target.target !== 'state') {
      throw new Error('Cerebral operator.push: You have to use a state template tag as first argument')
    }

    context.state.push(target.path, value)
  }

  push.displayName = 'operator.push'

  return push
}
