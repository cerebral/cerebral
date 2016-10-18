function whenFactory (template) {
  function when (context) {
    const exists = Boolean(template(context).toValue())

    return exists ? context.path.true() : context.path.false()
  }

  when.displayName = 'operator.when'

  return when
}

export default whenFactory
