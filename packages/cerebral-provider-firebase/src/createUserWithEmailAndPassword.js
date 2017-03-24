import firebase from 'firebase'
import {createUser} from './helpers'
import FirebaseProviderError from './FirebaseProviderError'

export default function createUserWithEmailAndPassword (email, password) {
  return new Promise((resolve, reject) => {
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(() => {
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
