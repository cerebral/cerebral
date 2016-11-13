export default function (target) {
  if (typeof target !== 'function') {
    throw new Error('Cerebral operator.shift: You have to use a state template tag as first argument')
  }

  function shift (context) {
    const targetTemplate = target(context)

    if (targetTemplate.target !== 'state') {
      throw new Error('Cerebral operator.shift: You have to use a state template tag as first argument')
    }

    context.state.shift(targetTemplate.path)
  }

  shift.displayName = 'operator.shift'

  return shift
}
