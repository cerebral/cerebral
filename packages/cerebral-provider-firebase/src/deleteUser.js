import firebase from 'firebase'

export default function deleteUser (password) {
  return new Promise((resolve, reject) => {
    const user = firebase.auth().currentUser

    return user.delete().then(() => resolve(), (error) => reject({error}))
  })
}
