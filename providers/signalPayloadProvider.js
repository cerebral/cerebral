module.exports = function (context, execution) {
  execution.signal.payload = execution.payload
  return context
}
