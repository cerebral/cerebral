module.exports = function () {
  return function(context, funcDetails, payload) {
    context.input = payload || {}

    return context
  }
}
