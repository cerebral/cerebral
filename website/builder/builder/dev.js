const path = require('path')
const express = require('express')
const app = express()
const extractMarkdownFiles = require('./extractMarkdownFiles')
const extractPages = require('./extractPages')
const render = require('./render')
const {readFile, readScript, extractRawText} = require('./utils')

Promise.all([
  extractMarkdownFiles(),
  extractPages()
])
  .then(function (results) {
    const docs = results[0]
    const pages = results[1]

    app.use('/images', express.static('images'))

    app.get('/docs/:sectionName*', function (req, res) {
      const docName = req.params[0] ? path.basename(req.params[0], '.html') : 'index'
      const Page = pages.docs
      const sectionName = req.params.sectionName

      render({
        pageName: 'docs',
        Page,
        docs,
        sectionName,
        docName
      })
        .then(function (view) {
          res.send(view)
        })
    })

    app.get('/docs-text.js', function (req, res) {
      res.writeHead(200, {'Content-Type': 'text/javascript'})
      res.write(JSON.stringify(extractRawText(docs)))
      res.end()
    })

    app.get('*.js', function (req, res) {
      readScript(`scripts/${req.params[0]}.js`)
        .then(function (content) {
          res.writeHead(200, {'Content-Type': 'text/javascript'})
          res.write(content)
          res.end()
        })
    })

    app.get('*.css', function (req, res) {
      readFile(`css/${req.params[0]}.css`)
        .then(function (content) {
          res.writeHead(200, {'Content-Type': 'text/css'})
          res.write(content)
          res.end()
        })
    })

    app.get('*', function (req, res) {
      if (path.extname(req.params[0]) && path.extname(req.params[0]) !== '.html') {
        return res.send(404)
      }

      const pageName = !req.params[0] || req.params[0] === '/' ? 'index' : path.basename(req.params[0], '.html')
      const Page = pages[pageName]

      render({
        pageName,
        Page
      })
        .then(function (view) {
          res.send(view)
        })
    })

    app.listen(3000, function () {
      console.log('Running server on 3000')
    })
  })
