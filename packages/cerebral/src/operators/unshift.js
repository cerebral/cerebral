export default function (target, value) {
  if (typeof target !== 'function') {
    throw new Error('Cerebral operator.set: You have to use a state template tag as first argument')
  }

  function unshift (context) {
    const targetTemplate = target(context)
    const unshiftValue = typeof value === 'function' ? value(context).value : value

    if (targetTemplate.target !== 'state') {
      throw new Error('Cerebral operator.unshift: You have to use a state template tag as first argument')
    }

    context.state.unshift(targetTemplate.path, unshiftValue)
  }

  unshift.displayName = 'operator.unshift'

  return unshift
}
