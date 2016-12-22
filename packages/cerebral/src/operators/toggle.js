import Tag from '../tags/Tag'

export default function (target) {
  if (!(target instanceof Tag) || target.type !== 'state') {
    throw new Error('Cerebral operator.toggle: You have to use the STATE TAG as first argument')
  }

  function toggle ({state, input}) {
    const getters = {state: state.get, input}
    const path = target.getPath(getters)

    state.set(path, !state.get(path))
  }

  toggle.displayName = 'operator.toggle'

  return toggle
}
