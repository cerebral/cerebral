export default function (target, value) {
  if (typeof target !== 'function') {
    throw new Error('Cerebral operator.concat: You have to use a state template tag as first argument')
  }

  function concat (context) {
    const targetTemplate = target(context)
    const concatValue = typeof value === 'function' ? value(context).value : value

    if (targetTemplate.target !== 'state') {
      throw new Error('Cerebral operator.concat: You have to use a state template tag as first argument')
    }

    context.state.concat(targetTemplate.path, concatValue)
  }

  concat.displayName = 'operator.concat'

  return concat
}
