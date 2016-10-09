'use strict';

const utils = require('../../../../utils/common');

function updateProfilesScores(context) {
  const firebase = context.firebase;
  const input = context.input;
  const data = context.input.data;
  const scoreModifier = input.scoreModifier;
  let profileKeys = [data.profileKey];

  if (data.householdKey) {
    profileKeys = Object.keys(context.input.household.members);
  }

  return Promise.all(profileKeys.map((memberKey) => {
    return firebase.transaction(`profiles/list/${memberKey}`, (maybeCurrentProfile) => {
      const currentProfile = maybeCurrentProfile || {
        activitiesCount: {},
        points: 0,
        co2: 0
      };

      if (!currentProfile.activitiesCount) {
        currentProfile.activitiesCount = {};
      }

      if (currentProfile.activitiesCount[data.activityKey]) {
        const currentActivityCount = currentProfile.activitiesCount[data.activityKey];

        currentProfile.activitiesCount[data.activityKey] = input.hasRemovedActivity ? currentActivityCount - 1 : currentActivityCount + 1;
      } else {
        currentProfile.activitiesCount = {
          [data.activityKey]: 1
        };
      }

      currentProfile.points = Number(currentProfile.points) + scoreModifier.points;
      currentProfile.co2 = utils.toCo2(Number(currentProfile.co2) + scoreModifier.co2);

      return currentProfile;
    });
  }))
  .then(() => null)
  .catch((error) => ({error: error.message}));
}

module.exports = updateProfilesScores;
