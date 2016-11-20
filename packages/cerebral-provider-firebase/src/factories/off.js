function offFactory (path, event, signal) {
  function off (context) {
    const pathTemplate = typeof path === 'function' ? path(context).value : path
    const eventTemplate = typeof event === 'function' ? event(context).value : event
    const signalTemplate = typeof signal === 'function' ? signal(context).value : signal

    context.firebase.off(pathTemplate, eventTemplate, signalTemplate)
  }

  return off
}

export default offFactory
