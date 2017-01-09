import firebase from 'firebase'
import {createUser} from './helpers'

export default function getUser () {
  return new Promise((resolve, reject) => {
    firebase.auth().getRedirectResult()
    .then(
      (result) => {
        if (result.user) {
          const user = createUser(result.user)

          if (result.credential) {
            user.accessToken = result.credential.accessToken
          }
          resolve({
            user: user,
            isRedirected: true
          })
        } else {
          const unsubscribe = firebase.auth().onAuthStateChanged(user => {
            unsubscribe()
            resolve({
              user: user ? createUser(user) : null,
              isRedirected: false
            })
          })
        }
      },
      (error) => {
        reject({
          code: error.code,
          message: error.message,
          email: error.email
        })
      }
    )
  })
}
