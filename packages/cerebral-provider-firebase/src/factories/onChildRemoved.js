import {convertObjectWithTemplates} from './utils'

function onChildRemovedFactory (path, signal, options = {}) {
  function onChildRemoved (context) {
    const pathTemplate = typeof path === 'function' ? path(context).value : path
    const signalTemplate = typeof signal === 'function' ? signal(context).value : signal

    context.firebase.onChildRemoved(pathTemplate, signalTemplate, convertObjectWithTemplates(options, context))
  }

  return onChildRemoved
}

export default onChildRemovedFactory
