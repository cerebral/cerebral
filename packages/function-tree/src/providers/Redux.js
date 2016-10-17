export default function ReduxProvider (store) {
  return (context) => {
    context.dispatch = (action) => {
      context.debugger && context.debugger.send({
        method: 'redux.dispatch',
        color: '#6333b1',
        args: [action]
      })
      store.dispatch(action)
    }
    context.getState = () => {
      return store.getState()
    }

    return context
  }
}
