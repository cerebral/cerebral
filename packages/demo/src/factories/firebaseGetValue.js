function firebaseGetValue (collectionName) {
  return function ({ firebase, path }) {
    return firebase.value(collectionName)
      .then(path.success)
      .catch(path.error)
  }
}

export default firebaseGetValue
