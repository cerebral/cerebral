function equalsFactory (target) {
  function equals (context) {
    const targetValue = target(context).value

    return context.path[targetValue] ? context.path[targetValue]() : context.path.otherwise()
  }

  equals.displayName = 'operator.equals'

  return equals
}

export default equalsFactory
