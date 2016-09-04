function InstanceProvider(execution) {
  return function(context) {
    context._instance = {
      id: execution.id,
      name: execution.name,
      datetime: execution.datetime,
      staticTree: execution.staticTree
    }

    return context
  }
}

module.exports = InstanceProvider
