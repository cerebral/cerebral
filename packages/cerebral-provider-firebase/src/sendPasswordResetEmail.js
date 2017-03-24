import firebase from 'firebase'

export default function sendPasswordResetEmail (email) {
  return firebase.auth().sendPasswordResetEmail(email).then(() => undefined)
}
