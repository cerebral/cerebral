function saveDraft ({state, path, firebase}) {
  const draft = state.get('clients.$draft')
  const uid = state.get('user.currentUser.uid')

  firebase.update(`clients.${uid}.${draft.ref}`, draft)
    .then(() => {
      state.set(`clients.all.${draft.ref}`, draft)
    })
    .then(path.success)
    .catch(path.error)
}

export default saveDraft
