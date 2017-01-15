function equalsFactory (target) {
  function equals ({state, input, path, resolve}) {
    if (!resolve.isTag(target, 'state', 'input')) {
      throw new Error('Cerebral operator.equals: You have to use the STATE or INPUT TAG as first argument')
    }

    const targetValue = resolve.value(target)

    return path[targetValue] ? path[targetValue]() : path.otherwise()
  }

  equals.displayName = `operator.equals(${String(target)})`

  return equals
}

export default equalsFactory
