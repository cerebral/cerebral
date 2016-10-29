export default function (targetTemplate) {
  if (typeof targetTemplate !== 'function') {
    throw new Error('Cerebral operator.pop: You have to use a state template tag as first argument')
  }

  function pop (context) {
    const target = targetTemplate(context)

    if (target.target !== 'state') {
      throw new Error('Cerebral operator.pop: You have to use a state template tag as first argument')
    }

    context.state.pop(target.path)
  }

  pop.displayName = 'operator.pop'

  return pop
}
