import { createReturnPromise } from '../helpers'

function signInAnonymouslyFactory() {
  function signInAnonymously({ firebase, path }) {
    return createReturnPromise(firebase.signInAnonymously(), path)
  }

  return signInAnonymously
}

export default signInAnonymouslyFactory
