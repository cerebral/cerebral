import {createReturnPromise} from '../helpers'

function valueFactory (valuePath) {
  function value ({firebase, path, resolve}) {
    return createReturnPromise(
      firebase.value(resolve.value(valuePath)),
      path
    )
  }

  return value
}

export default valueFactory
