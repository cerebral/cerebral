import Tag from '../tags/Tag'

export default function (target, ...args) {
  if (!(target instanceof Tag) || target.type !== 'state') {
    throw new Error('Cerebral operator.splice: You have to use the STATE TAG as first argument')
  }

  function splice ({state, input}) {
    const getters = {state: state.get, input}
    const spliceArgs = args.map(arg => (
      arg instanceof Tag ? arg.getValue(getters) : arg
    ))

    state.splice(target.getPath(getters), ...spliceArgs)
  }

  splice.displayName = 'operator.splice'

  return splice
}
