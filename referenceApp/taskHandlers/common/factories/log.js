function logFactory(message) {
  function log(context) {
    context.dashboard.log(
      context.input.task.id,
      message,
      context.input.error
    );
  }

  return log;
}

module.exports = logFactory;
