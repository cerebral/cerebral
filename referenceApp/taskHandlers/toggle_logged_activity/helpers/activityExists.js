function activityExists(loggedActivities, activityKey) {
  return Boolean(loggedActivities && activityKey in loggedActivities);
}

module.exports = activityExists;
