export default function (targetTemplate) {
  if (typeof targetTemplate !== 'function') {
    throw new Error('Cerebral operator.shift: You have to use a state template tag as first argument')
  }

  function shift (context) {
    const target = targetTemplate(context)

    if (target.target !== 'state') {
      throw new Error('Cerebral operator.shift: You have to use a state template tag as first argument')
    }

    context.state.shift(target.path)
  }

  shift.displayName = 'operator.shift'

  return shift
}
