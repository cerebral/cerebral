import firebase from 'firebase'
import {createUser} from './helpers'

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
        },
        (error) => {
          reject({error})
        }
      )
  })
}
