'use strict';

function calculateCurrentChallengePoints(profileKey, pointsModifier, profiles, totalLoggedpoints) {
  return (currentChallengePoints, currentProfileKey) => {
    currentChallengePoints.profiles[currentProfileKey] = profiles[currentProfileKey];
    let points = pointsModifier;

    if (totalLoggedpoints && totalLoggedpoints >= 30 && pointsModifier < 0) {
      points = 0;
    }

    if (currentProfileKey === profileKey) {
      currentChallengePoints.profiles[currentProfileKey] = Math.min(
        30,
        (currentChallengePoints.profiles[currentProfileKey] || 0) + points
      );
    }
    currentChallengePoints.sumPoints += currentChallengePoints.profiles[currentProfileKey];

    return currentChallengePoints;
  };
}

module.exports = calculateCurrentChallengePoints;
