export default function (target, value) {
  if (typeof target !== 'function') {
    throw new Error('Cerebral operator.merge: You have to use a state template tag as first argument')
  }

  function merge (context) {
    const targetTemplate = target(context)
    const mergeValue = typeof value === 'function' ? value(context).value : value

    if (targetTemplate.target !== 'state') {
      throw new Error('Cerebral operator.merge: You have to use a state template tag as first argument')
    }

    context.state.merge(targetTemplate.path, Object.keys(mergeValue).reduce((currentValue, key) => {
      currentValue[key] = typeof mergeValue[key] === 'function' ? mergeValue[key](context).value : mergeValue[key]

      return currentValue
    }, {}))
  }

  merge.displayName = 'operator.merge'

  return merge
}
