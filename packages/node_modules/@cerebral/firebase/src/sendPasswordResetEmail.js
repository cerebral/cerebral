import {noop as noReturnValue} from './helpers'
import firebase from 'firebase'
import {FirebaseProviderError} from './errors'

export default function sendPasswordResetEmail (email) {
  return firebase.auth().sendPasswordResetEmail(email)
    .then(noReturnValue)
    .catch((error) => {
      throw new FirebaseProviderError(error)
    })
}
