export default function ContextProvider (extendedContext) {
  return (context, funcDetails, payload) => {
    return Object.keys(extendedContext).reduce((context, key) => {
      if (context.debugger) {
        context[key] = {}

        /*
          Grab the prototype to add methods to proxy.
          We only grab actual added prototypes on first level, not nested and not
          where prototype is base prototypes like Objects and Functions
        */
        let proto = null

        if (
          extendedContext[key].constructor &&
          extendedContext[key].constructor.prototype.constructor !== Object.prototype.constructor &&
          extendedContext[key].constructor.prototype.constructor !== Function.prototype.constructor
        ) {
          proto = extendedContext[key].constructor.prototype
        }

        // The value might be a function that is already wrapped, try grabbing the original
        const contextValue = extendedContext[key]

        /*
          Wraps methods and sends their payload through the debugger
        */
        const proxy = (sourceKeys, target) => {
          return sourceKeys.reduce(function (obj, objKey) {
            if (typeof contextValue[objKey] === 'function') {
              obj[objKey] = (...args) => {
                context.debugger.send({
                  method: `${key}.${objKey}`,
                  args
                })

                return contextValue[objKey].apply(contextValue, args)
              }
            } else if (!(objKey in obj)) {
              Object.defineProperty(obj, objKey, {
                get () {
                  return contextValue[objKey]
                },
                set (value) {
                  context.debugger.send({
                    method: key + '.' + objKey + ' =',
                    args: [value]
                  })
                  contextValue[objKey] = value
                }
              })
            }

            return obj
          }, target)
        }

        // If the context value is a function, wrap it
        if (typeof contextValue === 'function') {
          context[key] = (...args) => {
            context.debugger.send({
              method: key,
              args
            })
            return contextValue.apply(null, args)
          }
        }

        // Go through keys original value and wrap any attached methods
        context[key] = proxy(Object.keys(contextValue), context[key])// Object.keys(contextValue).reduce(proxy, context[key])
        // Go through proto
        context[key] = proto ? proxy(Object.getOwnPropertyNames(proto), context[key]) : context[key]
      } else {
        context[key] = extendedContext[key]
      }

      return context
    }, context)
  }
}
