function setFieldFactory(fieldPath, fieldValue) {
  function setField({ state, resolve }) {
    if (!resolve.isTag(fieldPath, 'state')) {
      throw new Error(
        'Cerebral Forms - operator.setField: You have to use the STATE TAG as first argument'
      )
    }

    state.merge(resolve.path(fieldPath), {
      value: resolve.value(fieldValue),
      isPristine: false,
    })
  }

  return setField
}

export default setFieldFactory
