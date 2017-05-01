import {createReturnPromise} from '../helpers'

function signInWithEmailAndPasswordFactory (email, password) {
  function signInWithEmailAndPassword ({firebase, path, resolve}) {
    return createReturnPromise(
      firebase.signInWithEmailAndPassword(resolve.value(email), resolve.value(password)),
      path
    )
  }

  return signInWithEmailAndPassword
}

export default signInWithEmailAndPasswordFactory
