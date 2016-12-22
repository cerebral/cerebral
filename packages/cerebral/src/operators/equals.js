function equalsFactory (target) {
  function equals ({state, input, path}) {
    const getters = {state: state.get, input}
    const targetValue = target(getters).value

    return path[targetValue] ? path[targetValue]() : path.otherwise()
  }

  equals.displayName = 'operator.equals'

  return equals
}

export default equalsFactory
