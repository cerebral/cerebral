module.exports = function (extendedContext) {
  return function (context, funcDetails, payload) {
    return Object.keys(extendedContext).reduce(function (context, key) {
      function proxy (sourceKeys, source, target) {
        return sourceKeys.reduce(function (obj, objKey) {
          if (typeof contextValue[objKey] === 'function') {
            obj[objKey] = function () {
              context.debugger.send({
                method: key + '.' + objKey,
                color: context.debugger.getColor(key),
                args: [].slice.call(arguments)
              })
              return contextValue[objKey].apply(contextValue, arguments)
            }
          } else if (!(objKey in obj)) {
            Object.defineProperty(obj, objKey, {
              get () {
                return contextValue[objKey]
              },
              set (value) {
                context.debugger.send({
                  method: key + '.' + objKey + ' =',
                  color: context.debugger.getColor(key),
                  args: [value]
                })
                contextValue[objKey] = value
              }
            })
          }

          return obj
        }, target)
      }

      if (context.debugger) {
        context[key] = {}

        // Grab the prototype to add methods to proxy.
        // We only grab actual added prototypes on first level, not nested and not
        // where prototype is base prototypes like Objects and Functions
        var proto = null
        if (
          extendedContext[key].constructor &&
          extendedContext[key].constructor.prototype.constructor !== Object.prototype.constructor &&
          extendedContext[key].constructor.prototype.constructor !== Function.prototype.constructor
        ) {
          proto = extendedContext[key].constructor.prototype
        }

        // The value might be a function that is already wrapped, try grabbing the original
        var contextValue = extendedContext[key]

        // If the context value is a function, wrap it
        if (typeof contextValue === 'function') {
          context[key] = function () {
            context.debugger.send({
              method: key,
              color: context.debugger.getColor(key),
              args: [].slice.call(arguments)
            })
            return contextValue.apply(null, arguments)
          }
        }

        // Go through keys original value and wrap any attached methods
        context[key] = proxy(Object.keys(contextValue), contextValue, context[key])// Object.keys(contextValue).reduce(proxy, context[key])
        // Go through proto
        context[key] = proto ? proxy(Object.getOwnPropertyNames(proto), proto, context[key]) : context[key]
      } else {
        context[key] = extendedContext[key]
      }

      return context
    }, context)
  }
}
