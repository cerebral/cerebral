import { createReturnPromise } from '../helpers'

function valueFactory(valuePath, options = {}) {
  function value({ firebase, path, resolve }) {
    return createReturnPromise(
      firebase.value(resolve.value(valuePath), resolve.value(options)),
      path
    )
  }

  return value
}

export default valueFactory
