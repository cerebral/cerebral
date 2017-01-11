function equalsFactory (target) {
  function equals ({state, input, path, resolveArg}) {
    if (!resolveArg.isTag(target, 'state', 'input')) {
      throw new Error('Cerebral operator.equals: You have to use the STATE or INPUT TAG as first argument')
    }

    const targetValue = resolveArg.value(target)

    return path[targetValue] ? path[targetValue]() : path.otherwise()
  }

  equals.displayName = 'operator.equals'

  return equals
}

export default equalsFactory
