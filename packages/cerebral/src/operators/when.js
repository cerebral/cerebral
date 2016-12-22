import Tag from '../tags/Tag'

function whenFactory (...args) {
  const whenFunc = args.length > 1 ? args[args.length - 1] : null
  const valueTemplates = args.length > 1 ? args.slice(0, -1) : args

  function when ({state, input, path}) {
    const getters = {state: state.get, input}
    const values = valueTemplates.map(value => value instanceof Tag ? value.getValue(getters) : value)
    const isTrue = Boolean(whenFunc ? whenFunc(...values) : values[0])

    return isTrue ? path.true() : path.false()
  }

  when.displayName = 'operator.when'

  return when
}

export default whenFactory
