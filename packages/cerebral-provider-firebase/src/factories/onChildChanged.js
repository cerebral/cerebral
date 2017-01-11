import {convertObjectWithTemplates} from './utils'

function onChildChangedFactory (path, signal, options = {}) {
  function onChildChanged ({firebase, resolveArg}) {
    firebase.onChildChanged(resolveArg.value(path), resolveArg.value(signal), convertObjectWithTemplates(options, resolveArg))
  }

  return onChildChanged
}

export default onChildChangedFactory
