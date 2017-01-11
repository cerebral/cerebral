import {convertObjectWithTemplates} from './utils'

function onChildRemovedFactory (path, signal, options = {}) {
  function onChildRemoved ({firebase, resolveArg}) {
    firebase.onChildRemoved(resolveArg.value(path), resolveArg.value(signal), convertObjectWithTemplates(options, resolveArg))
  }

  return onChildRemoved
}

export default onChildRemovedFactory
