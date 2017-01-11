function dispatchFactory (type) {
  function func ({input, dispatch}) {
    dispatch({
      type,
      payload: input
    })
  }
  func.displayName = `dispatch - ${type}`

  return func
}

module.exports = dispatchFactory
