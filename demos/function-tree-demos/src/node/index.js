'use strict'

const runTask = require('./runTask')
const getCerebralMembers = require('./functions/getCerebralMembers')
const takeAvatars = require('./functions/takeAvatars')
const writeAvatars = require('./functions/writeAvatars')

runTask([
  getCerebralMembers, {
    success: [
      takeAvatars,
      writeAvatars
    ],
    error: [

    ]
  }
])
