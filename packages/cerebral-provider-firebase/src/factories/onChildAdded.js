import {convertObjectWithTemplates} from './utils'

function onChildAddedFactory (path, signal, options = {}) {
  function onChildAdded ({firebase, resolveArg}) {
    firebase.onChildAdded(resolveArg.value(path), resolveArg.value(signal), convertObjectWithTemplates(options, resolveArg))
  }

  return onChildAdded
}

export default onChildAddedFactory
