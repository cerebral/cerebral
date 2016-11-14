export default function (target) {
  if (typeof target !== 'function') {
    throw new Error('Cerebral operator.pop: You have to use a state template tag as first argument')
  }

  function pop (context) {
    const targetTemplate = target(context)

    if (targetTemplate.target !== 'state') {
      throw new Error('Cerebral operator.pop: You have to use a state template tag as first argument')
    }

    context.state.pop(targetTemplate.path)
  }

  pop.displayName = 'operator.pop'

  return pop
}
