function onValueFactory (path, signal) {
  function onValue (context) {
    const pathTemplate = typeof path === 'function' ? path(context).value : path
    const signalTemplate = typeof signal === 'function' ? signal(context).value : signal

    context.firebase.onValue(pathTemplate, signalTemplate)
  }

  return onValue
}

export default onValueFactory
