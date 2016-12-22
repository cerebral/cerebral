import Tag from '../tags/Tag'

export default function (target, ...values) {
  if (!(target instanceof Tag) || target.type !== 'state') {
    throw new Error('Cerebral operator.merge: You have to use the STATE TAG as first argument')
  }

  function merge ({state, input}) {
    const getters = {state: state.get, input}

    state.merge(target.getPath(getters), ...values.map((value) => {
      if (value instanceof Tag) {
        return value.getValue(getters)
      }

      return Object.keys(value).reduce((currentValue, key) => {
        currentValue[key] = value[key] instanceof Tag ? value[key].getValue(getters) : value[key]

        return currentValue
      }, {})
    }))
  }

  merge.displayName = 'operator.merge'

  return merge
}
