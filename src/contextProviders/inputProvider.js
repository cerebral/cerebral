module.exports = function (input) {
  return function (context) {
    context.input = input

    return context
  }
}
