function checkParticipantExists (context) {
  const challengeKey = context.input.data.challengeKey
  const householdKey = context.input.householdKey

  return context.firebase.value(`households/challenges/${householdKey}/${challengeKey}`)
    .then((result) => {
      if (result.value === null) {
        return context.path.success()
      }
      return context.path.alreadyParticipant()
    }
  ).catch(context.path.error)
}

module.exports = checkParticipantExists
