'use strict'

const resolveTask = require('../common/actions/resolveTask')
const rejectTask = require('../common/actions/rejectTask')
const verifyUserIsAdmin = require('./actions/verifyUserIsAdmin')
const createNotificationJoinHousehold = require('./actions/createNotificationJoinHousehold')
const addNotification = require('./actions/addNotification')

module.exports = [
  verifyUserIsAdmin, {
    error: [rejectTask],
    success: [
      createNotificationJoinHousehold,
      addNotification, {
        error: [rejectTask],
        success: [
          resolveTask
        ]
      }
    ]
  }
]
