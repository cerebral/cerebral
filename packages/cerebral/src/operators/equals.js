import Tag from '../tags/Tag'

function equalsFactory (target) {
  if (!(target instanceof Tag) || !(target.type === 'state' || target.type === 'input')) {
    throw new Error('Cerebral operator.equals: You have to use the STATE or INPUT TAG as first argument')
  }

  function equals ({state, input, path}) {
    const getters = {state: state.get, input}
    const targetValue = target.getValue(getters)

    return path[targetValue] ? path[targetValue]() : path.otherwise()
  }

  equals.displayName = 'operator.equals'

  return equals
}

export default equalsFactory
