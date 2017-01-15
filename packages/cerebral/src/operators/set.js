export default function (target, value) {
  function set ({state, input, resolveArg}) {
    if (!resolveArg.isTag(target, 'state', 'input')) {
      throw new Error('Cerebral operator.set: You have to use the STATE or INPUT TAG as first argument')
    }

    if (target.type === 'state') {
      state.set(resolveArg.path(target), resolveArg.value(value))
    } else {
      const result = Object.assign({}, input)
      const parts = resolveArg.path(target).split('.')
      const key = parts.pop()
      const targetObj = parts.reduce((target, key) => {
        return (target[key] = Object.assign({}, target[key] || {}))
      }, result)
      targetObj[key] = resolveArg.value(value)

      return result
    }
  }

  set.displayName = 'operator.set'

  return set
}
