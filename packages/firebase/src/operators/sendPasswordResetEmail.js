import {createReturnPromise} from '../helpers'

function sendPasswordResetEmailFactory (email) {
  function sendPasswordResetEmail ({firebase, path, resolve}) {
    return createReturnPromise(
      firebase.sendPasswordResetEmail(resolve.value(email)),
      path
    )
  }

  return sendPasswordResetEmail
}

export default sendPasswordResetEmailFactory
