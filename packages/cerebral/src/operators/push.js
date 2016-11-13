export default function (target, value) {
  if (typeof target !== 'function') {
    throw new Error('Cerebral operator.push: You have to use a state template tag as first argument')
  }

  function push (context) {
    const targetTemplate = target(context)
    const pushValue = typeof value === 'function' ? value(context).value : value

    if (targetTemplate.target !== 'state') {
      throw new Error('Cerebral operator.push: You have to use a state template tag as first argument')
    }

    context.state.push(targetTemplate.path, pushValue)
  }

  push.displayName = 'operator.push'

  return push
}
