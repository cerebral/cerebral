export default function (target, ...args) {
  if (typeof target !== 'function') {
    throw new Error('Cerebral operator.splice: You have to use a STATE TAG as first argument')
  }

  function splice ({state, input}) {
    const getters = {state: state.get, input}
    const targetTemplate = target(getters)
    if (targetTemplate.target !== 'state') {
      throw new Error('Cerebral operator.splice: You have to use a STATE TAG as first argument')
    }

    const spliceArgs = args.map(arg => (
      typeof arg === 'function' ? arg(getters).value : arg
    ))

    state.splice(targetTemplate.path, ...spliceArgs)
  }

  splice.displayName = 'operator.splice'

  return splice
}
