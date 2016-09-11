'use strict';

const resolveTask = require('../common/actions/resolveTask');
const rejectTask = require('../common/actions/rejectTask');
const getChallenge = require('./actions/getChallenge');
const getHouseholdKey = require('./actions/getHouseholdKey');
const checkParticipantExists = require('./actions/checkParticipantExists');
const getDepartmentKey = require('./actions/getDepartmentKey');
const addChallengeParticipant = require('./actions/addChallengeParticipant');
const incrementChallengeParticipants = require('./actions/incrementChallengeParticipants');

module.exports = [
  [
    getChallenge,
    getHouseholdKey
  ],
  checkParticipantExists, {
    error: [rejectTask],
    alreadyParticipant: [resolveTask],
    success: [
      getDepartmentKey, {
        error: [rejectTask],
        success: [
          addChallengeParticipant, {
            error: [rejectTask],
            success: [
              incrementChallengeParticipants, {
                error: [rejectTask],
                success: [
                  resolveTask
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];
