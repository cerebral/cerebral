import firebase from 'firebase'
import { createUser } from './helpers'
import { FirebaseProviderAuthenticationError } from './errors'

export default function signInAnonymously() {
  return new Promise((resolve, reject) => {
    firebase
      .auth()
      .signInAnonymously()
      .then(
        () => {
          const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            unsubscribe()
            resolve(createUser(user))
          })
        },
        (error) => {
          reject(new FirebaseProviderAuthenticationError(error))
        }
      )
  })
}
