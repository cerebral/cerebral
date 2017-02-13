function removeClient ({props, firebase, state, path}) {
  const uid = state.get('user.$currentUser.uid')
  return firebase.remove(`clients.${uid}.${props.ref}`)
    .then(path.success)
    .catch(path.error)
}

export default removeClient
