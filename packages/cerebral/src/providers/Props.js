function PropsProviderFactory () {
  function PropsProvider (context, functionDetails, payload) {
    context.props = payload

    return context
  }

  return PropsProvider
}

export default PropsProviderFactory
