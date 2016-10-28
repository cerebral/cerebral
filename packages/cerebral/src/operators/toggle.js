export default function (targetTemplate) {
  function toggle (context) {
    const {target, path} = targetTemplate(context)

    if (target !== 'state') {
      throw new Error('Cerebral operator.toggle: You have to use a state template tag as first argument')
    }

    context.state.set(path, !context.state.get(path))
  }

  toggle.displayName = 'operator.toggle'

  return toggle
}
