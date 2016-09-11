const activityKeysToObject = require('./activityKeysToObject');

function removeActivity(loggedActivities, activityKeyToRemove) {
  return Object.keys(loggedActivities)
      .filter((loggedActivityKey) => {
        return loggedActivityKey !== activityKeyToRemove;
      })
      .reduce(activityKeysToObject, {});
}

module.exports = removeActivity;
