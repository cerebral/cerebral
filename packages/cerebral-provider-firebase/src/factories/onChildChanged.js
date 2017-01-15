import {convertObjectWithTemplates} from './utils'

function onChildChangedFactory (path, signal, options = {}) {
  function onChildChanged ({firebase, resolve}) {
    firebase.onChildChanged(resolve.value(path), resolve.value(signal), convertObjectWithTemplates(options, resolve))
  }

  return onChildChanged
}

export default onChildChangedFactory
