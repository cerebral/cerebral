function incrementChallengeParticipants(context) {
  const departmentKey = context.input.departmentKey;
  const challengeKey = context.input.data.challengeKey;

  return context.firebase.transaction(`challenges/list/${challengeKey}/participantCounts/${departmentKey}`, count => count ? count + 1 : 1)
    .then(context.path.success)
    .catch(context.path.error);
}

module.exports = incrementChallengeParticipants;
