import Tag from '../tags/Tag'

export default function (target, value) {
  if (!(target instanceof Tag) || target.type !== 'state') {
    throw new Error('Cerebral operator.unshift: You have to use the STATE TAG as first argument')
  }

  function unshift ({state, input}) {
    const getters = {state: state.get, input}
    const unshiftValue = value instanceof Tag ? value.getValue(getters) : value

    state.unshift(target.getPath(getters), unshiftValue)
  }

  unshift.displayName = 'operator.unshift'

  return unshift
}
