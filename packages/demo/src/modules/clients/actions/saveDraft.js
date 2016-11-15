import firebaseUpdateItem from '../../../factories/firebaseUpdateItem'

function saveDraft ({state, path, firebase}) {
  const draft = state.get('clients.$draft')
  const uid = state.get('user.currentUser.uid')

  return firebaseUpdateItem({
    firebase: firebase,
    moduleName: 'clients',
    uid: uid,
    id: draft.ref,
    payload: draft
  })
    .then(() => {
      state.set(`clients.all.${draft.ref}`, draft)
    })
    .then(path.success)
    .catch(path.error)
}

export default saveDraft
