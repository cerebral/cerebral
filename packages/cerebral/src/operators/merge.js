export default function (target, ...values) {
  function merge ({state, input, resolveArg}) {
    if (!resolveArg.isTag(target, 'state')) {
      throw new Error('Cerebral operator.merge: You have to use the STATE TAG as first argument')
    }

    state.merge(resolveArg.path(target), ...values.map((value) => {
      if (resolveArg.isTag(value)) {
        return resolveArg.value(value)
      }

      return Object.keys(value).reduce((currentValue, key) => {
        currentValue[key] = resolveArg.value(value[key])

        return currentValue
      }, {})
    }))
  }

  merge.displayName = 'operator.merge'

  return merge
}
