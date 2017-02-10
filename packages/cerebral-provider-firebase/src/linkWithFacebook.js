import firebase from 'firebase'
import {createUser} from './helpers'

export default function linkWithFacebook (options = {}) {
  const scopes = options.scopes || []
  const redirect = options.redirect || false
  const provider = new firebase.auth.FacebookAuthProvider()

  scopes.forEach((scope) => {
    provider.addScope(scope)
  })

  return new Promise((resolve, reject) => {
    if (redirect) {
      firebase.auth().currentUser.linkWithRedirect(provider)
      resolve()
    } else {
      firebase.auth().currentUser.linkWithPopup(provider)
      .then(
        (result) => {
          const user = createUser(result.user)

          user.accessToken = result.credential.accessToken
          resolve({
            user: user
          })
        },
        (error) => {
          reject({
            code: error.code,
            message: error.message,
            email: error.email
          })
        }
      )
    }
  })
}
