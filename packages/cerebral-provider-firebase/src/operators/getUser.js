import {createReturnPromise} from '../helpers'

function getUserFactory () {
  function getUser ({firebase, path}) {
    return createReturnPromise(
      firebase.getUser(),
      path
    )
  }

  return getUser
}

export default getUserFactory
