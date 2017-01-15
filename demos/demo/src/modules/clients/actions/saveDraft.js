import firebaseUpdateItem from '../../../factories/firebaseUpdateItem'

function saveDraft ({state, path, firebase}) {
  const draft = state.get('clients.$draft')
  const uid = state.get('user.$currentUser.uid')
  return firebaseUpdateItem({
    firebase,
    moduleName: 'clients',
    uid,
    id: draft.ref,
    payload: draft
  })
    .then(path.success)
    .catch(path.error)
}

export default saveDraft
