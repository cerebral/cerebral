import Tag from '../tags/Tag'

export default function (target, value) {
  if (!(target instanceof Tag) || !(target.type === 'state' || target.type === 'input')) {
    throw new Error('Cerebral operator.set: You have to use the STATE or INPUT TAG as first argument')
  }

  function set ({state, input}) {
    const getters = {state: state.get, input}
    const setValue = value instanceof Tag ? value.getValue(getters) : value

    if (target.type === 'state') {
      state.set(target.getPath(getters), setValue)
    } else {
      const result = Object.assign({}, input)
      const parts = target.getPath(getters).split('.')
      const key = parts.pop()
      const targetObj = parts.reduce((target, key) => {
        return (target[key] = Object.assign({}, target[key] || {}))
      }, result)
      targetObj[key] = setValue

      return result
    }
  }

  set.displayName = 'operator.set'

  return set
}
