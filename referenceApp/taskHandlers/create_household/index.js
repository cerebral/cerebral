'use strict';

const resolveTask = require('../common/actions/resolveTask');
const rejectTask = require('../common/actions/rejectTask');
const createHousehold = require('./actions/createHousehold');
const setHousehold = require('./actions/setHousehold');
const updateProfile = require('./actions/updateProfile');

module.exports = [
  createHousehold,
  setHousehold, {
    error: [rejectTask],
    success: [
      updateProfile, {
        error: [rejectTask],
        success: [
          resolveTask
        ]
      }
    ]
  }
];
