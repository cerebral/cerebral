const activityKeysToObject = require('./activityKeysToObject');

function addActivity(activities, loggedActivities, category, activityKeyToAdd) {
  return Object.keys(loggedActivities)
    .filter((loggedActivityKey) => {
      return (
        !activities[category][loggedActivityKey] ||
        activities[category][loggedActivityKey].subCategory === null ||
        activities[category][loggedActivityKey].subCategory !==
        activities[category][activityKeyToAdd].subCategory
      );
    })
    .concat(activityKeyToAdd)
    .reduce(activityKeysToObject, {});
}

module.exports = addActivity;
