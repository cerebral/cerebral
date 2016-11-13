function whenFactory (target, whenFunc) {
  function when (context) {
    const targetValue = target(context).value
    const isTrue = Boolean(typeof whenFunc === 'function' ? whenFunc(targetValue) : targetValue)

    return isTrue ? context.path.true() : context.path.false()
  }

  when.displayName = 'operator.when'

  return when
}

export default whenFactory
