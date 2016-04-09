module.exports = function (contextProviders) {
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
