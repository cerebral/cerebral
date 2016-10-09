'use strict';

const log = require('../../common/factories/log');
const activities = require('../../../../resources/activities');
const activityExists = require('../helpers/activityExists');
const removeActivity = require('../helpers/removeActivity');
const addActivity = require('../helpers/addActivity');
const getScoreModifier = require('../helpers/getScoreModifier');
const utils = require('../../../../utils/common');

function toggleLoggedActivity(context) {
  const firebase = context.firebase;
  const data = context.input.data;
  let loggedActivities = null;
  let hasRemovedActivity = false;
  const selectedActivity = context.input.selectedActivity;
  let scoreModifier = {
    points: 0,
    co2: 0
  };
  let path = '';

  if (data.householdKey) {
    path = `activities/logged/households/${data.datetime}/${data.householdKey}`;
  } else {
    path = `activities/logged/profiles/${data.datetime}/${data.profileKey}`;
  }

  return firebase.transaction(path, (maybeCurrentLog) => {
    const currentLog = maybeCurrentLog || {
      activities: {},
      lastAddedDateTime: Date.now(),
      points: 0,
      co2: 0
    };
    const currentLoggedActivities = currentLog.activities;

    if (activityExists(currentLoggedActivities, data.activityKey)) {
      hasRemovedActivity = true;
      scoreModifier = getScoreModifier(selectedActivity, currentLoggedActivities, data.categoryKey, data.activityKey, true);

      loggedActivities = {
        activities: removeActivity(currentLoggedActivities, data.activityKey),
        lastAddedDateTime: currentLog.lastAddedDateTime,
        points: Number(currentLog.points) + scoreModifier.points,
        co2: utils.toCo2(Number(currentLog.co2) + scoreModifier.co2)
      };
    } else {
      scoreModifier = getScoreModifier(selectedActivity, currentLoggedActivities, data.categoryKey, data.activityKey, false);
      loggedActivities = {
        activities: addActivity(activities, currentLoggedActivities || {}, data.categoryKey, data.activityKey),
        lastAddedDateTime: data.datetime,
        points: Number(currentLog.points) + scoreModifier.points,
        co2: utils.toCo2(Number(currentLog.co2) + scoreModifier.co2)
      };
    }

    return loggedActivities;
  })
    .then(() => {
      return context.path.success({
        loggedActivities,
        scoreModifier,
        hasRemovedActivity
      });
    })
    .catch(context.path.error);
}

module.exports = (continueChain) => {
  return [
    toggleLoggedActivity, {
      success: continueChain,
      error: [
        log('Could not toggle logged activity')
      ]
    }
  ];
};
