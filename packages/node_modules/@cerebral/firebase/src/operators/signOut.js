import {createReturnPromise} from '../helpers'

function signOutFactory () {
  function signOut ({firebase, path}) {
    return createReturnPromise(
      firebase.signOut(),
      path
    )
  }

  return signOut
}

export default signOutFactory
