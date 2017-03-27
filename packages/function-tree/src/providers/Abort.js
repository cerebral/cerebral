function AbortProviderFactory () {
  function AbortProvider (context) {
    context.abort = context.execution.abort

    return context
  }

  return AbortProvider
}

export default AbortProviderFactory
