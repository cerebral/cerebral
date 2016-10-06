import firebase from 'firebase'
import {createUser} from './helpers'

export default function signInAnonymously () {
  return new Promise((resolve, reject) => {
    firebase.auth().signInAnonymously()
      .then(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged(user => {
          unsubscribe()
          resolve({
            user: createUser(user)
          })
        })
      })
      .catch(reject)
  })
}
