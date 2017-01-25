export default function (target, ...args) {
  function splice ({state, input, resolveArg}) {
    if (!resolveArg.isTag(target, 'state')) {
      throw new Error('Cerebral operator.splice: You have to use the STATE TAG as first argument')
    }

    const spliceArgs = args.map(arg => resolveArg.value(arg))

    state.splice(resolveArg.path(target), ...spliceArgs)
  }

  splice.displayName = `operator.splice(${String(target)}, ${args.map((arg) => {
    return String(arg)
  }).join(',')})`

  return splice
}
