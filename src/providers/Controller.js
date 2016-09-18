function ControllerProviderFactory(controller) {
  function ControllerProvider(context) {
    context.controller = controller

    return context
  }

  return ControllerProvider
}

export default ControllerProviderFactory
