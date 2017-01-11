function updateActivitiesCount (activitiesCount, activityKey, hasRemovedActivity) {
  if (!activitiesCount) {
    return {
      [activityKey]: 1
    }
  }

  return Object.keys(activitiesCount).reduce((currentActivitiesCount, activityCountKey) => {
    if (activityKey === activityCountKey) {
      currentActivitiesCount[activityCountKey] = (
        hasRemovedActivity
          ? activitiesCount[activityCountKey] - 1
          : activitiesCount[activityCountKey] + 1
      )
    } else {
      currentActivitiesCount[activityCountKey] = activitiesCount[activityCountKey]
    }

    return currentActivitiesCount
  }, {})
}

module.exports = updateActivitiesCount
