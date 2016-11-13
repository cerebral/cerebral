export default function (target) {
  if (typeof target !== 'function') {
    throw new Error('Cerebral operator.unset: You have to use a state template tag as first argument')
  }

  function unset (context) {
    const targetTemplate = target(context)

    if (targetTemplate.target !== 'state') {
      throw new Error('Cerebral operator.unset: You have to use a state template tag as first argument')
    }

    context.state.unset(targetTemplate.path)
  }

  unset.displayName = 'operator.unset'

  return unset
}
