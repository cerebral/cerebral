import {convertObjectWithTemplates} from './utils'

function onChildChangedFactory (path, signal, options = {}) {
  function onChildChanged (context) {
    const pathTemplate = typeof path === 'function' ? path(context).value : path
    const signalTemplate = typeof signal === 'function' ? signal(context).value : signal

    context.firebase.onChildChanged(pathTemplate, signalTemplate, convertObjectWithTemplates(options, context))
  }

  return onChildChanged
}

export default onChildChangedFactory
