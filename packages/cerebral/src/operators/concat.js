import Tag from '../tags/Tag'

export default function (target, value) {
  if (!(target instanceof Tag) || target.type !== 'state') {
    throw new Error('Cerebral operator.concat: You have to use the STATE TAG as first argument')
  }

  function concat ({state, input}) {
    const getters = {state: state.get, input}
    const concatValue = value instanceof Tag ? value.getValue(getters) : value

    state.concat(target.getPath(getters), concatValue)
  }

  concat.displayName = 'operator.concat'

  return concat
}
