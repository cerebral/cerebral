function whenFactory (...args) {
  const whenFunc = args.length > 1 ? args[args.length - 1] : null
  const valueTemplates = args.length > 1 ? args.slice(0, -1) : args

  function when ({state, input, path, resolve}) {
    const values = valueTemplates.map(value => resolve.value(value))
    const isTrue = Boolean(whenFunc ? whenFunc(...values) : values[0])

    return isTrue ? path.true() : path.false()
  }

  when.displayName = `operator.when(${args.filter((arg) => {
    return typeof arg !== 'function'
  }).map((arg) => {
    return String(arg)
  }).join(',')})`

  return when
}

export default whenFactory
