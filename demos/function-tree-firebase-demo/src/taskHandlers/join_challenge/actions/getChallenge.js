function getChallenge (context) {
  const challengeKey = context.input.data.challengeKey

  return context.firebase.value(`challenges/list/${challengeKey}`)
    .then(result => ({challenge: result.value}))
}

module.exports = getChallenge
