'use strict';

const log = require('../../common/factories/log');
const utils = require('../../../../utils/common');

function updateChallengeDayScores(context) {
  const data = context.input.data;
  const firebase = context.firebase;
  const scoreModifier = context.input.scoreModifier;
  const transactionPath = `challenges/scores/${data.challengeKey}/${data.departmentKey}/days/${data.datetime}/`;

  return firebase.transaction(transactionPath, (currentChallengePoints) => {
    if (!currentChallengePoints) {
      const newCurrentChallengePoints = {
        points: {energy: 0, consumption: 0, food: 0, transport: 0, social: 0},
        co2: {energy: 0, consumption: 0, food: 0, transport: 0, social: 0}
      };

      newCurrentChallengePoints.points[data.categoryKey] = scoreModifier.points;
      newCurrentChallengePoints.co2[data.categoryKey] = scoreModifier.co2;

      return newCurrentChallengePoints;
    }

    return {
      points: utils.merge(currentChallengePoints.points, {
        [data.categoryKey]: (
          Number(currentChallengePoints.points[data.categoryKey]) +
          Number(scoreModifier.points)
        )
      }),
      co2: utils.merge(currentChallengePoints.co2, {
        [data.categoryKey]: utils.toCo2(
          Number(currentChallengePoints.co2[data.categoryKey]) +
          Number(scoreModifier.co2)
        )
      })
    };

  })
  .then(() => null)
  .catch((error) => ({error: error.message}));
}

module.exports = updateChallengeDayScores;
