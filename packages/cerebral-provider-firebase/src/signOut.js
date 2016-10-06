import firebase from 'firebase'

export default function signOut () {
  return firebase.auth().signOut()
}
