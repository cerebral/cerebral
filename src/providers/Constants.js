function ConstantsProviderFactory(constants) {
  const contextConstants = (
    Array.isArray(constants) ?
      constants.reduce((allConstants, constant) => {
        allConstants[constant] = constant

        return allConstants
      }, {})
    :
      constants
  )

  function ConstantsProvider(context) {
    context.constants = contextConstants

    return context
  }

  return ConstantsProvider
}

export default ConstantsProviderFactory
