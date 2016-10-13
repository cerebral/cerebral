function existingActivityScoresSubtraction (activities, loggedActivities, category, activityKeyToAdd) {
  return Object.keys(loggedActivities)
    .filter((loggedActivityKey) => {
      return (
        activities[category][loggedActivityKey] !== activities[category][activityKeyToAdd] &&
        activities[category][loggedActivityKey] &&
        activities[category][loggedActivityKey].subCategory !== null &&
        activities[category][loggedActivityKey].subCategory ===
        activities[category][activityKeyToAdd].subCategory
      )
    })
    .reduce((pointsAndCo2, filteredActivityKey) => {
      pointsAndCo2.points += activities[category][filteredActivityKey].points
      pointsAndCo2.co2 += activities[category][filteredActivityKey].co2

      return pointsAndCo2
    }, {
      points: 0,
      co2: 0
    })
}

module.exports = existingActivityScoresSubtraction
