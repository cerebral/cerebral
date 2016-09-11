'use strict';

const utils = require('../../../../utils/common');
const createNewLeaderboardHousehold = require('../helpers/createNewLeaderboardHousehold');
const sortByTotalCo2 = require('../../common/helpers/sortByTotalCo2');

function updateChallengeDepartmentEmployeesLeaderboard(context) {
  const data = context.input.data;
  const input = context.input;
  const firebase = context.firebase;
  const scoreModifier = context.input.scoreModifier;
  const transactionPath = `challenges/leaderboards/${data.challengeKey}/${data.departmentKey}/employees`;

  if (!input.household || !input.household.companies || !input.household.companies[input.challenge.companyKey]) {
    return;
  }

  return firebase.transaction(transactionPath, (maybeCurrentChallengeLeaderboard) => {
    const currentChallengeLeaderboard = maybeCurrentChallengeLeaderboard || {};

    const leaderboardHousehold = (
      currentChallengeLeaderboard[data.householdKey] ?
        utils.merge({}, currentChallengeLeaderboard[data.householdKey])
      :
        createNewLeaderboardHousehold()
    );

    if (!leaderboardHousehold.days[data.datetime]) {
      leaderboardHousehold.days[data.datetime] = {
        points: {energy: 0, food: 0, social: 0, transport: 0, consumption: 0},
        co2: {energy: 0, food: 0, social: 0, transport: 0, consumption: 0}
      };
    }

    leaderboardHousehold.days[data.datetime].co2[data.categoryKey] = (
      utils.toCo2(
        leaderboardHousehold.days[data.datetime].co2[data.categoryKey] +
        scoreModifier.co2
      )
    );

    leaderboardHousehold.days[data.datetime].points[data.categoryKey] += scoreModifier.points;

    leaderboardHousehold.totalPoints += scoreModifier.points;

    leaderboardHousehold.totalCo2 = utils.toCo2(leaderboardHousehold.totalCo2 + scoreModifier.co2);

    currentChallengeLeaderboard[data.householdKey] = leaderboardHousehold;

    return Object.keys(currentChallengeLeaderboard)
      .sort(sortByTotalCo2(currentChallengeLeaderboard))
      .reduce((newChallengeLeaderboard, key, index) => {
        newChallengeLeaderboard[key] = currentChallengeLeaderboard[key];
        newChallengeLeaderboard[key].position = index + 1;

        return newChallengeLeaderboard;
      }, {});
  })
  .then(() => null);
}

module.exports = updateChallengeDepartmentEmployeesLeaderboard;
