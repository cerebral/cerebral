module.exports = function (contextProviders) {
  contextProviders = contextProviders.reduce(function (uniqueContextProviders, contextProvider) {
    if (uniqueContextProviders.indexOf(contextProvider) === -1) {
      return uniqueContextProviders.concat(contextProvider)
    }
    return uniqueContextProviders
  }, [])
  return contextProviders.reduce(function (context, contextProvider) {
    if (typeof contextProvider === 'function') {
      return contextProvider(context)
    } else {
      return Object.keys(contextProvider).reduce(function (context, key) {
        context[key] = contextProvider[key]

        return context
      }, context)
    }
  }, {})
}
