module.exports = function (extendedContext) {
  return function(context, funcDetails, payload) {
    return Object.keys(extendedContext).reduce(function (context, key) {
      if (context.debugger) {

        // Grab the prototype to insert methods defined there into instance later.
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
        var existingContextValue = extendedContext[key].__ft_originFunc || extendedContext[key]

        // If the context value is a function, wrap it
        if (typeof existingContextValue === 'function') {
          context[key] = function () {
            context.debugger.send({
              method: key,
              color: context.debugger.getColor(key),
              args: [].slice.call(arguments)
            })
            existingContextValue.apply(context, arguments)
          };
          context[key].__ft_originFunc = existingContextValue
        }

        // Go through keys original value and wrap any attached methods
        context[key] = Object.keys(existingContextValue).reduce(function (obj, objKey) {
          if (typeof existingContextValue[objKey] === 'function') {
            var originalFunc = existingContextValue[objKey].__ft_originFunc || existingContextValue[objKey]

            obj[objKey] = function () {
              context.debugger.send({
                method: key + '.' + objKey,
                color: context.debugger.getColor(key),
                args: [].slice.call(arguments)
              })
              return originalFunc.apply(obj, arguments)
            }
            existingContextValue[objKey].__ft_originFunc = originalFunc
          }

          return obj
        }, context[key] || existingContextValue) // Depending it being a function that has been wrapped or the original object

        // Grab methods of prototype and add it
        if (proto) {
          context[key] = Object.getOwnPropertyNames(proto).reduce(function (obj, objKey) {
            if (typeof proto[objKey] === 'function' && objKey !== 'constructor') {
              var originalFunc = proto[objKey].__ft_originFunc || proto[objKey]

              obj[objKey] = function () {
                context.debugger.send({
                  method: key + '.' + objKey,
                  color: context.debugger.getColor(key),
                  args: [].slice.call(arguments)
                })
                return originalFunc.apply(existingContextValue, arguments)
              }
              obj[objKey].__ft_originFunc = originalFunc
            }

            return obj
          }, context[key])
        }
      } else {
        context[key] = extendedContext[key]
      }

      return context
    }, context)
  }
}
