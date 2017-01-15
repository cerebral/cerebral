import {convertObjectWithTemplates} from './utils'

function onChildAddedFactory (path, signal, options = {}) {
  function onChildAdded ({firebase, resolve}) {
    firebase.onChildAdded(resolve.value(path), resolve.value(signal), convertObjectWithTemplates(options, resolve))
  }

  return onChildAdded
}

export default onChildAddedFactory
