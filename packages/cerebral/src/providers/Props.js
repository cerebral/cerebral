function PropsProviderFactory () {
  function PropsProvider (context, functionDetails, payload) {
    context.props = payload
    context.input = {}

    Object.keys(context.props).forEach((key) => {
      const value = context.props[key]

      Object.defineProperty(context.input, key, {
        get () {
          console.warn(`DEPRECATION: You are using the input property "${key}" in signal "${context.execution.name}", action "${functionDetails.name}". Use props instead`)
          return value
        }
      })
    })

    return context
  }

  return PropsProvider
}

export default PropsProviderFactory
