export default function (target, value) {
  function set ({state, props, resolve}) {
    if (!resolve.isTag(target, 'state', 'props')) {
      throw new Error('Cerebral operator.set: You have to use the STATE or PROPS TAG as first argument')
    }

    if (target.type === 'state') {
      state.set(resolve.path(target), resolve.value(value))
    } else {
      const result = Object.assign({}, props)
      const parts = resolve.path(target).split('.')
      const key = parts.pop()
      const targetObj = parts.reduce((target, key) => {
        return (target[key] = Object.assign({}, target[key] || {}))
      }, result)
      targetObj[key] = resolve.value(value)

      return result
    }
  }

  set.displayName = `operator.set(${String(target)}, ${String(value)})`

  return set
}
