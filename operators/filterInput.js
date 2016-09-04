function filterInputFactory(filterFunc) {
  function filterInput(context) {
    if (filterFunc(context.input)) {
      return context.result.accepted()
    }

    return context.result.discarded()
  }

  return filterInput
}

module.exports = filterInputFactory;
