const {isUrl} = require('./utils')
const config = require('../config.json')

module.exports = function (pageName) {
  const defaultScripts = config.scripts['*'] ? config.scripts['*'] : []
  const scripts = config.scripts[pageName] ? defaultScripts.concat(config.scripts[pageName]) : defaultScripts

  return scripts.reduce(function (scripTags, script) {
    const tag = `<script src="${isUrl(script) ? script : `/${script}.js`}"></script>`

    return `${scripTags}\n${tag}`
  }, '')
}
