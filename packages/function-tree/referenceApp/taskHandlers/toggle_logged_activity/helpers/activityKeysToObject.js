function activityKeysToObject (filteredLoggedActivities, filteredActivityKey) {
  filteredLoggedActivities[filteredActivityKey] = true
  return filteredLoggedActivities
}

module.exports = activityKeysToObject
