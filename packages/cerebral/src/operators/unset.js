export default function (targetTemplate) {
  if (typeof targetTemplate !== 'function') {
    throw new Error('Cerebral operator.unset: You have to use a state template tag as first argument')
  }

  function unset (context) {
    const target = targetTemplate(context)

    if (target.target !== 'state') {
      throw new Error('Cerebral operator.unset: You have to use a state template tag as first argument')
    }

    context.state.unset(target.path)
  }

  unset.displayName = 'operator.unset'

  return unset
}
