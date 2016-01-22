'use strict'
// config to prevent bump major version until we will reach 1.0.0
var parseRawCommit = require('conventional-changelog/lib/git').parseRawCommit

module.exports = function (pluginConfig, _ref, cb) {
  var commits = _ref.commits
  // default release type
  var type = 'patch'

  commits.map(function (commit) {
    return parseRawCommit(commit.hash + '\n' + commit.message)
  }).filter(function (commit) {
    return !!commit
  }).every(function (commit) {
    if (commit.breaks.length) {
      // bump minor version if breaking changes declared
      // it is ok, until we have not reached 1.0.0
      type = 'minor'
      return false
    }

    return true
  })

  cb(null, type)
}
