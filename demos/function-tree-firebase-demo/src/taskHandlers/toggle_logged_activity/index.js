'use strict'

const outputSelectedActivity = require('./actions/outputSelectedActivity')
const toggleLoggedActivity = require('./chains/toggleLoggedActivity')
const getProfile = require('../common/actions/getProfile.js')
const getChallenge = require('../common/actions/getChallenge.js')
const getHousehold = require('../common/actions/getHousehold.js')
const updateProfilesScores = require('./actions/updateProfilesScores.js')
const updateChallengeDayScores = require('./actions/updateChallengeDayScores.js')
const updateChallengeDepartmentAllLeaderboard = require('./actions/updateChallengeDepartmentAllLeaderboard.js')
const updateChallengeDepartmentEmployeesLeaderboard = require('./actions/updateChallengeDepartmentEmployeesLeaderboard.js')
const updateChallengeTotalScores = require('./actions/updateChallengeTotalScores.js')
// const updateHouseholdScores = require('./actions/updateHouseholdScores.js');
const resolveTask = require('../common/actions/resolveTask')

module.exports = [
  outputSelectedActivity,
  [
    getProfile,
    getChallenge,
    getHousehold
  ],
  ...toggleLoggedActivity([
    [
      updateProfilesScores, // Spread scores when household activity
      // updateHouseholdScores // If household activity
      updateChallengeDayScores, // "challenges.$challengeKey.$departmentKey.days"
      updateChallengeTotalScores, // "challenges.$challengeKey.$departmentKey.total"
      updateChallengeDepartmentAllLeaderboard,
      updateChallengeDepartmentEmployeesLeaderboard // Check company on household
    ],
    resolveTask
  ])
]
