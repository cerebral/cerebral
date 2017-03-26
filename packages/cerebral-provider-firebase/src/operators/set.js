import {createReturnPromise} from '../helpers'

function setFactory (setPath, value) {
  function set ({firebase, path, resolve}) {
    return createReturnPromise(
      firebase.set(resolve.value(setPath), resolve.value(value)),
      path
    )
  }

  return set
}

export default setFactory
