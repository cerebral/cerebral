function DebuggerProviderFactory () {
  function DebuggerProvider (context, functionDetails, payload) {
    const devtools = context.controller.devtools

    context.debugger = {
      send (debuggerData) {
        devtools.send(debuggerData, context, functionDetails, payload)
      },
      getColor () {
        return '#333'
      }
    }

    devtools.send(null, context, functionDetails, payload)

    return context
  }

  return DebuggerProvider
}

export default DebuggerProviderFactory
