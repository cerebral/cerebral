'use strict'

const getScoreModifier = require('../helpers/getScoreModifier')
const utils = require('../../../../utils/common')

function updateHouseholdScores (context) {
  const firebase = context.firebase
  const data = context.input.data
  const selectedActivity = context.input.selectedActivity

  if (context.input.household) {
    let loggedActivities = null
    let scoreModifier = {
      points: 0,
      co2: 0
    }

    return firebase.transaction(`activities/logged/households/${data.datetime}/${data.householdKey}`, (maybeCurrentLog) => {
      const currentLog = maybeCurrentLog || {
        points: 0,
        co2: 0
      }
      const currentLoggedActivities = currentLog.activities

      scoreModifier = getScoreModifier(selectedActivity, currentLoggedActivities, data.categoryKey, data.activityKey)

      loggedActivities = {
        points: Number(currentLog.points) + scoreModifier.points,
        co2: utils.toCo2(Number(currentLog.co2) + scoreModifier.co2)
      }

      return loggedActivities
    })
  }
}

module.exports = updateHouseholdScores
