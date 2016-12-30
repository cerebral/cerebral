export default function (target, value) {
  function push ({state, input, resolveArg}) {
    if (!resolveArg.isTag(target, 'state')) {
      throw new Error('Cerebral operator.push: You have to use the STATE TAG as first argument')
    }

    state.push(resolveArg.path(target), resolveArg.value(value))
  }

  push.displayName = 'operator.push'

  return push
}
