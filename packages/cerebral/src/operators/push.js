import Tag from '../tags/Tag'

export default function (target, value) {
  if (!(target instanceof Tag) || target.type !== 'state') {
    throw new Error('Cerebral operator.push: You have to use the STATE TAG as first argument')
  }

  function push ({state, input}) {
    const getters = {state: state.get, input}
    const pushValue = value instanceof Tag ? value.getValue(getters) : value

    state.push(target.getPath(getters), pushValue)
  }

  push.displayName = 'operator.push'

  return push
}
