import Tag from '../tags/Tag'

export default function (target) {
  if (!(target instanceof Tag) || target.type !== 'state') {
    throw new Error('Cerebral operator.unset: You have to use the STATE TAG as first argument')
  }

  function unset ({state, input}) {
    const getters = {state: state.get, input}

    state.unset(target.getPath(getters))
  }

  unset.displayName = 'operator.unset'

  return unset
}
