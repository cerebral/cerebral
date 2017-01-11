export default function (target, value) {
  function concat ({state, input, resolveArg}) {
    if (!resolveArg.isTag(target, 'state')) {
      throw new Error('Cerebral operator.concat: You have to use the STATE TAG as first argument')
    }

    state.concat(resolveArg.path(target), resolveArg.value(value))
  }

  concat.displayName = 'operator.concat'

  return concat
}
