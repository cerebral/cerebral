import {createReturnPromise} from '../helpers'

function pushFactory (pushPath, value) {
  function push ({firebase, path, resolve}) {
    return createReturnPromise(
      firebase.push(resolve.value(pushPath), resolve.value(value)),
      path
    )
  }

  return push
}

export default pushFactory
