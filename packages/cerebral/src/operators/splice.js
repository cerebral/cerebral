export default function (target, ...args) {
  if (typeof target !== 'function') {
    throw new Error('Cerebral operator.splice: You have to use a state template tag as first argument')
  }

  function splice (context) {
    const targetTemplate = target(context)
    if (targetTemplate.target !== 'state') {
      throw new Error('Cerebral operator.splice: You have to use a state template tag as first argument')
    }

    const spliceArgs = args.map(arg => (
      typeof arg === 'function' ? arg(context).value : arg
    ))

    context.state.splice(targetTemplate.path, ...spliceArgs)
  }

  splice.displayName = 'operator.splice'

  return splice
}
