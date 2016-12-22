import Tag from '../tags/Tag'

export default function (target) {
  if (!(target instanceof Tag) || target.type !== 'state') {
    throw new Error('Cerebral operator.pop: You have to use the STATE TAG as first argument')
  }

  function pop ({state, input}) {
    const getters = {state: state.get, input}

    state.pop(target.getPath(getters))
  }

  pop.displayName = 'operator.pop'

  return pop
}
