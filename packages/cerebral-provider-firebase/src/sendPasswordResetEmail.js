import firebase from 'firebase'

export default function sendPasswordResetEmail (email) {
  return new Promise((resolve, reject) => {
    firebase.auth().sendPasswordResetEmail(email)
      .then(
        () => resolve(),
        (error) => reject({error})
      )
  })
}
