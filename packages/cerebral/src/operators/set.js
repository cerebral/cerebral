export default function (target, value) {
  if (typeof target !== 'function') {
    throw new Error('Cerebral operator.set: You have to use a state template tag as first argument')
  }

  function set (context) {
    const targetTemplate = target(context)
    const setValue = typeof value === 'function' ? value(context).value : value

    if (targetTemplate.target !== 'state') {
      throw new Error('Cerebral operator.set: You have to use a state template tag as first argument')
    }

    context.state.set(targetTemplate.path, setValue)
  }

  set.displayName = 'operator.set'

  return set
}
