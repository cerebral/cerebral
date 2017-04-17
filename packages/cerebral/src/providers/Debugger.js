function DebuggerProviderFactory () {
  function DebuggerProvider (context, functionDetails, payload, prevPayload) {
    const devtools = context.controller.devtools

    if (devtools.preventInputPropReplacement) {
      Object.keys(payload).forEach((key) => {
        if (prevPayload && key in prevPayload && prevPayload[key] !== payload[key]) {
          throw new Error(`Cerebral Devtools - You have activated the "preventInputPropReplacement" option and in signal "${context.execution.name}", before the action "${functionDetails.name}", the key "${key}" was replaced`)
        }
      })
    }

    context.debugger = {
      send (debuggerData) {
        devtools.sendExecutionData(debuggerData, context, functionDetails, payload)
      },
      getColor () {
        return '#333'
      },
      wrapProvider (providerKey) {
        const provider = context[providerKey]

        context[providerKey] = Object.keys(provider).reduce((wrappedProvider, key) => {
          const originalFunc = provider[key]

          wrappedProvider[key] = (...args) => {
            context.debugger.send({
              method: `${providerKey}.${key}`,
              args: args
            })

            return originalFunc.apply(provider, args)
          }

          return wrappedProvider
        }, (
          typeof provider === 'function' ? (...args) => {
            context.debugger.send({
              method: `${providerKey}`,
              args: args
            })

            return provider.apply(provider, args)
          } : {}
        ))
      }
    }

    return context
  }

  return DebuggerProvider
}

export default DebuggerProviderFactory
