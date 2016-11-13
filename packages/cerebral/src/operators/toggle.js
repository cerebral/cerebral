export default function (target) {
  if (typeof target !== 'function') {
    throw new Error('Cerebral operator.toggle: You have to use a state template tag as first argument')
  }

  function toggle (context) {
    const targetTemplate = target(context)

    if (targetTemplate.target !== 'state') {
      throw new Error('Cerebral operator.toggle: You have to use a state template tag as first argument')
    }

    context.state.set(targetTemplate.path, !context.state.get(targetTemplate.path))
  }

  toggle.displayName = 'operator.toggle'

  return toggle
}
