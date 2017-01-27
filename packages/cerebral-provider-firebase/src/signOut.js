import firebase from 'firebase'

export default function signOut () {
  return firebase.auth().signOut()
    .then(() => {
      for (let key in window.localStorage) {
        if (key.indexOf('firebase:authUser') === 0) {
          window.localStorage.removeItem(key)
        }
      }
    })
}
