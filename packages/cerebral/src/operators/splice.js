export default function (target, ...args) {
  function splice ({state, resolve}) {
    if (!resolve.isTag(target, 'state')) {
      throw new Error('Cerebral operator.splice: You have to use the STATE TAG as first argument')
    }

    const spliceArgs = args.map(arg => resolve.value(arg))

    state.splice(resolve.path(target), ...spliceArgs)
  }

  splice.displayName = `operator.splice(${String(target)}, ${args.map((arg) => {
    return String(arg)
  }).join(',')})`

  return splice
}
