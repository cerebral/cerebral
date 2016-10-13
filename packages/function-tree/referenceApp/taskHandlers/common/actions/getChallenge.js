function getChallenge (context) {
  const firebase = context.firebase
  const data = context.input.data
  const challengeKey = data.challengeKey

  return firebase.value(`challenges/list/${challengeKey}`)
  .then((response) => {
    return {challenge: response.value}
  })
}

module.exports = getChallenge
