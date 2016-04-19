module.exports = function (context, execution, controller) {
  context.services = controller.getServices()

  return context
}
