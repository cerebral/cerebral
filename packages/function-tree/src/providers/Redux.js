function ReduxProvider (store) {
  return (context) => {
    context.dispatch = function (action) {
      context.debugger && context.debugger.send({
        method: 'redux.dispatch',
        color: '#6333b1',
        args: [action]
      })
      store.dispatch(action)
    }
    context.getState = function () {
      return store.getState()
    }

    return context
  }
}

module.exports = ReduxProvider
