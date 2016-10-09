const activities = require('../../../../resources/activities');

function outputSelectedActivity(context) {
  const activityKey = context.input.data.activityKey;
  const category = context.input.data.categoryKey;

  return {
    selectedActivity: activities[category][activityKey]
  };
}

module.exports = outputSelectedActivity;
