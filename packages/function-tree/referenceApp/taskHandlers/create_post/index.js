'use strict'

const resolveTask = require('../common/actions/resolveTask')
const rejectTask = require('../common/actions/rejectTask')
const createPost = require('./actions/createPost')
const pushPost = require('./actions/pushPost')

module.exports = [
  createPost,
  pushPost, {
    success: [
      resolveTask
    ],
    error: [
      rejectTask
    ]
  }
]
