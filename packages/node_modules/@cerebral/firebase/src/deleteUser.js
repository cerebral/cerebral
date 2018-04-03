import { noop as noReturnValue } from './helpers'
import firebase from 'firebase'
import { FirebaseProviderError } from './errors'

export default function deleteUser(password) {
  const user = firebase.auth().currentUser

  return user
    .delete()
    .then(noReturnValue)
    .catch((error) => {
      throw new FirebaseProviderError(error)
    })
}
