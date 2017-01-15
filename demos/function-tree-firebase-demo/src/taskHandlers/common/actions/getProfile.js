function getProfile (context) {
  const firebase = context.firebase
  const data = context.input.data
  const profileKey = data.profileKey

  return firebase.value(`profiles/list/${profileKey}`)
    .then((response) => {
      if (context.path) {
        return context.path.success({profile: response.value})
      }

      return {profile: response.value}
    })
    .catch((error) => {
      if (context.path) {
        return context.path.error({error})
      }

      return {error}
    })
}

module.exports = getProfile
