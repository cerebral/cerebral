export default function (target) {
  function pop ({state, input, resolveArg}) {
    if (!resolveArg.isTag(target, 'state')) {
      throw new Error('Cerebral operator.pop: You have to use the STATE TAG as first argument')
    }

    state.pop(resolveArg.path(target))
  }

  pop.displayName = 'operator.pop'

  return pop
}
