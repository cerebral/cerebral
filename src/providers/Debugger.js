function DebuggerProviderFactory(cerebralDebugger) {
  function DebuggerProvider(context, functionDetails, payload) {
    context.debugger = {
      send(debuggerData) {
        cerebralDebugger.send(debuggerData, context, functionDetails, payload)
      },
      getColor() {
        return '#333';
      }
    }

    cerebralDebugger.send(null, context, functionDetails, payload)

    return context
  }

  return DebuggerProvider
}

export default DebuggerProviderFactory
