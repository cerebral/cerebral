import firebase from 'firebase'
import {FirebaseProviderError} from './errors'

export default function signOut () {
  return firebase.auth().signOut()
    .then(() => {
      for (let key in window.localStorage) {
        if (key.indexOf('firebase:authUser') === 0) {
          window.localStorage.removeItem(key)
        }
      }
    })
    .catch((error) => {
      throw new FirebaseProviderError(error)
    })
}
