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
        devtools.send(debuggerData, context, functionDetails, payload)
      },
      getColor () {
        return '#333'
      }
    }

    return context
  }

  return DebuggerProvider
}

export default DebuggerProviderFactory
