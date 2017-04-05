import {createReturnPromise} from '../helpers'

function createUserWithEmailAndPasswordFactory (email, password) {
  function createUserWithEmailAndPassword ({firebase, path, resolve}) {
    return createReturnPromise(
      firebase.createUserWithEmailAndPassword(resolve.value(email), resolve.value(password)),
      path
    )
  }

  return createUserWithEmailAndPassword
}

export default createUserWithEmailAndPasswordFactory
