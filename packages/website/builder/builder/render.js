const path = require('path')
const React = require('react')
const ReactDOMServer = require('react-dom/server')
const stringTemplate = require('string-template')
const renderScripts = require('./renderScripts')
const renderCss = require('./renderCss')
const fs = require('fs')
const indexHtml = fs
  .readFileSync(path.resolve('index.template.html'))
  .toString()
const config = require('../config.json')

module.exports = function({ pageName, Page, docs, sectionName, docName }) {
  return Promise.all([renderScripts(pageName), renderCss(pageName)])
    .then(function(results) {
      const scripts = results[0]
      const css = results[1]

      return stringTemplate(indexHtml, {
        title: config.title,
        body: ReactDOMServer.renderToStaticMarkup(
          <Page
            pageName={pageName}
            sectionName={sectionName}
            docName={docName}
            docs={docs}
          />
        ),
        css,
        scripts,
      })
    })
    .catch(function(error) {
      console.error(error)
    })
}
