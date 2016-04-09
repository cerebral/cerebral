module.exports = function (next) {
  return function (context) {
    context.output = next

    return context
  }
}
