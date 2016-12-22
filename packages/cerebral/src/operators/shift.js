import Tag from '../tags/Tag'

export default function (target) {
  if (!(target instanceof Tag) || target.type !== 'state') {
    throw new Error('Cerebral operator.shift: You have to use the STATE TAG as first argument')
  }

  function shift ({state, input}) {
    const getters = {state: state.get, input}

    state.shift(target.getPath(getters))
  }

  shift.displayName = 'operator.shift'

  return shift
}
