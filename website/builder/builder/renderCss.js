const {isUrl} = require('./utils')
const config = require('../config.json')

module.exports = function (pageName) {
  const defaultCss = config.css['*'] ? config.css['*'] : []
  const css = config.css[pageName] ? defaultCss.concat(config.css[pageName]) : defaultCss

  return css.reduce(function (cssTags, cssContent) {
    const tag = `<link rel="stylesheet" href="${isUrl(cssContent) ? cssContent : `/${cssContent}.css`}" />`

    return `${cssTags}\n${tag}`
  }, '')
}
