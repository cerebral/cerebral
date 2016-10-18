export default function (template) {
  function toggle ({input, state}) {
    const {target, path} = template()

    if (target !== 'state') {
      throw new Error('Cerebral operator.toggle: You have to use a state template tag as first argument')
    }

    state.set(path, !state.get(path))
  }

  toggle.displayName = 'operator.toggle'

  return toggle
}
