import {convertObjectWithTemplates} from './utils'

function onChildAddedFactory (path, signal, options = {}) {
  function onChildAdded (context) {
    const pathTemplate = typeof path === 'function' ? path(context).value : path
    const signalTemplate = typeof signal === 'function' ? signal(context).value : signal

    context.firebase.onChildAdded(pathTemplate, signalTemplate, convertObjectWithTemplates(options, context))
  }

  return onChildAdded
}

export default onChildAddedFactory
