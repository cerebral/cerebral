function signOut({ firebase, path }) {
  return firebase.signOut().then(path.success).catch(path.error)
}

export default signOut
