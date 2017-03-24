import firebase from 'firebase'
import {createUser} from './helpers'
import FirebaseProviderError from './FirebaseProviderError'

export default function signInWithEmailAndPassword (email, password) {
  return new Promise((resolve, reject) => {
    firebase.auth().signInWithEmailAndPassword(email, password)
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
