export default function firebaseUpdateItem ({firebase, moduleName, uid, id, payload}) {
  const payloadWithDates = Object.assign({}, {
    updated_at: {'.sv': 'timestamp'},
    created_at: payload.created_at || {'.sv': 'timestamp'}
  }, payload)
  return firebase.update(`${moduleName}.${uid}.${id}`, payloadWithDates)
}
