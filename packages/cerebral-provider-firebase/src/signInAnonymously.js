import firebase from 'firebase'
import {createUser} from './helpers'
import FirebaseProviderError from './FirebaseProviderError'

export default function signInAnonymously () {
  return new Promise((resolve, reject) => {
    firebase.auth().signInAnonymously()
    .then(
      () => {
        const unsubscribe = firebase.auth().onAuthStateChanged(user => {
          unsubscribe()
          resolve({
            user: createUser(user)
          })
        })
      }, (error) => {
        reject(new FirebaseProviderError(error.message))
      })
  })
}
