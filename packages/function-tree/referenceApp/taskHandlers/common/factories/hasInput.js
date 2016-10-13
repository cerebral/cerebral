function hasInputFactory (prop) {
  function hasInput (context) {
    if (context.input[prop]) {
      return context.path.true()
    }

    return context.path.false()
  }

  return hasInput
}

module.exports = hasInputFactory
