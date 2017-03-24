import firebase from 'firebase'

export default function deleteUser (password) {
  const user = firebase.auth().currentUser

  return user.delete().then(() => undefined)
}
