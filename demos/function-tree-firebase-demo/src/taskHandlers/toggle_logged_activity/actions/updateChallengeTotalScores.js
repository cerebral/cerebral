'use strict'

const utils = require('../../../../utils/common')

function updateChallengeTotalScores (context) {
  const data = context.input.data
  const firebase = context.firebase
  const scoreModifier = context.input.scoreModifier
  const transactionPath = `challenges/scores/${data.challengeKey}/${data.departmentKey}/total/`

  return firebase.transaction(transactionPath, (maybeCurrentChallengeTotalPoints) => {
    const currentChallengeTotalPoints = maybeCurrentChallengeTotalPoints || {
      points: 0,
      co2: 0
    }

    currentChallengeTotalPoints.points = Number(currentChallengeTotalPoints.points) + scoreModifier.points
    currentChallengeTotalPoints.co2 = utils.toCo2(Number(currentChallengeTotalPoints.co2) + scoreModifier.co2)

    return currentChallengeTotalPoints
  })
  .then(() => null)
  .catch((error) => ({error: error.message}))
}

module.exports = updateChallengeTotalScores
