import firebaseUpdateItem from '../../../factories/firebaseUpdateItem'

function saveDraft ({firebase, state, path}) {
  const draft = state.get('projects.$draft')
  const uid = state.get('user.$currentUser.uid')
  return firebaseUpdateItem({
    firebase,
    moduleName: 'projects',
    uid,
    id: draft.ref,
    payload: draft
  })
    .then(path.success)
    .catch(path.error)
}

export default saveDraft
