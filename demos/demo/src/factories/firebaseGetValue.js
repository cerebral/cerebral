export default function firebaseGetValue ({firebasePath, uidPath}) {
  return function ({firebase, state, path}) {
    let uid = ''
    if (uidPath) {
      uid = `.${state.get(uidPath)}`
    }
    return firebase.value(`${firebasePath}${uid}`)
      .then((result) => {
        return result.value ? path.success(result) : path.success({value: {}})
      })
      .catch(path.error)
  }
}
