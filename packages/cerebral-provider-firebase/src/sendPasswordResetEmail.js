import firebase from 'firebase'
import FirebaseProviderError from './FirebaseProviderError'

export default function sendPasswordResetEmail (email) {
  return firebase.auth().sendPasswordResetEmail(email)
    .then(() => undefined)
    .catch((error) => {
      throw new FirebaseProviderError(error.message)
    })
}
