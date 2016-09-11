'use strict';

const existingActivitySubCategoryScoresSubtraction = require('../helpers/existingActivitySubCategoryScoresSubtraction');
const activities = require('../../../../resources/activities');

function getScoreModifier(selectedActivity, currentLoggedActivities, categoryKey, activityKey, activityExists) {
  let pointsAndCo2Modifier = {
    points: 0,
    co2: 0
  };

  if (activityExists) {
    pointsAndCo2Modifier = {
      points: -selectedActivity.points,
      co2: -selectedActivity.co2
    };
  } else {
    const subtraction = existingActivitySubCategoryScoresSubtraction(
      activities,
      currentLoggedActivities || {},
      categoryKey,
      activityKey
    );

    pointsAndCo2Modifier = {
      points: Number(selectedActivity.points) - Number(subtraction.points),
      co2: Number(selectedActivity.co2) - Number(subtraction.co2)
    };
  }

  return pointsAndCo2Modifier;
}

module.exports = getScoreModifier;
