function whenFactory (...args) {
  const whenFunc = args.length > 1 ? args[args.length - 1] : null
  const valueTemplates = args.length > 1 ? args.slice(0, -1) : args
  function when (context) {
    const values = valueTemplates.map(value => typeof value === 'function' ? value(context).value : value)
    const isTrue = Boolean(whenFunc ? whenFunc(...values) : values[0])

    return isTrue ? context.path.true() : context.path.false()
  }

  when.displayName = 'operator.when'

  return when
}

export default whenFactory
