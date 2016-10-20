'use strict'

const resolveTask = require('../common/actions/resolveTask')
const rejectTask = require('../common/actions/rejectTask')
const createProfile = require('./actions/createProfile')
const setProfile = require('./actions/setProfile')

module.exports = [
  createProfile,
  setProfile, {
    success: [
      resolveTask
    ],
    error: [
      rejectTask
    ]
  }
]
