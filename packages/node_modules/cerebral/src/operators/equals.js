function equalsFactory (target) {
  function equals ({state, props, path, resolve}) {
    if (!resolve.isTag(target, 'state', 'props')) {
      throw new Error('Cerebral operator.equals: You have to use the STATE or PROPS TAG as first argument')
    }

    const targetValue = resolve.value(target)

    return path[targetValue] ? path[targetValue]() : path.otherwise()
  }

  equals.displayName = `operator.equals(${String(target)})`

  return equals
}

export default equalsFactory
