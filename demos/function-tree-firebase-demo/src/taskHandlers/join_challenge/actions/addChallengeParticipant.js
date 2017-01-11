function addChallengeParticipant (context) {
  const challengeKey = context.input.data.challengeKey
  const householdKey = context.input.householdKey
  const departmentKey = context.input.departmentKey

  return context.firebase.set(`households/challenges/${householdKey}/${challengeKey}`, {
    challengeEndDatetime: context.input.challenge.endDatetime,
    joinedDatetime: Date.now(),
    department: departmentKey
  })
    .then(context.path.success)
    .catch(context.path.error)
}

module.exports = addChallengeParticipant
