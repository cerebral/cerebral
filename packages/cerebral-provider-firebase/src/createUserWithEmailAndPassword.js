import firebase from 'firebase'
import {createUser} from './helpers'

export default function createUserWithEmailAndPassword (email, password) {
  return firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(
      () => {
        return new Promise((resolve) => {
          const unsubscribe = firebase.auth().onAuthStateChanged(user => {
            unsubscribe()
            resolve({
              user: createUser(user)
            })
          })
        })
      },
      (error) => {
        return {
          error: {
            code: error.code,
            message: error.message
          }
        }
      }
    )
}
