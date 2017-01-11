'use strict'

const resolveTask = require('../common/actions/resolveTask')
const rejectTask = require('../common/actions/rejectTask')
const createPostComment = require('./actions/createPostComment')
const pushPostComment = require('./actions/pushPostComment')

module.exports = [
  createPostComment,
  pushPostComment, {
    success: [
      resolveTask
    ],
    error: [
      rejectTask
    ]
  }
]
