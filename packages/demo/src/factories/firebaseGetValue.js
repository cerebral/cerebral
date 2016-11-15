function firebaseGetValue ({firebasePath, uidPath, localCollectionPath}) {
  return function ({firebase, state, path}) {
    let uid = ''
    if (uidPath) {
      // firebase collection is under an user_id
      uid = `.${state.get(uidPath)}`
    }

    return firebase.value(`${firebasePath}${uid}`)
      .then((result) => {
        state.set(localCollectionPath, result.value || [])
        return path.success(result)
      })
      .catch(path.error)
  }
}

export default firebaseGetValue
