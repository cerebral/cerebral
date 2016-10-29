export default function (targetTemplate, ...argTemplates) {
  if (typeof targetTemplate !== 'function') {
    throw new Error('Cerebral operator.splice: You have to use a state template tag as first argument')
  }

  function splice (context) {
    const target = targetTemplate(context)
    if (target.target !== 'state') {
      throw new Error('Cerebral operator.splice: You have to use a state template tag as first argument')
    }

    const args = argTemplates.map(valueTemplate => (
      typeof valueTemplate === 'function' ? valueTemplate(context).toValue() : valueTemplate
    ))

    context.state.splice(target.path, ...args)
  }

  splice.displayName = 'operator.splice'

  return splice
}
