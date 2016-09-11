const resolveTask = require('../common/actions/resolveTask');
const rejectTask = require('../common/actions/rejectTask');
const hasInput = require('../common/factories/hasInput');
const getProfile = require('../common/actions/getProfile');
const getNotification = require('./actions/getNotification');
const updateHouseholdMembersAndCompanies = require('./actions/updateHouseholdMembersAndCompanies');
const updateProfileHousehold = require('./actions/updateProfileHousehold');

module.exports = [
  getProfile, {
    error: [rejectTask],
    success: [
      getNotification, {
        error: [rejectTask],
        success: [
          hasInput('notification'), {
            false: [rejectTask],
            true: [
              [
                updateHouseholdMembersAndCompanies,
                updateProfileHousehold
              ],
              resolveTask
            ]
          }
        ]
      }
    ]
  }
];
