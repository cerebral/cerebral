const fs = require('fs')
const path = require('path')
const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')

const config = require('../webpack.electron.config')

const compiler = webpack(config)
const app = express()

app.get('/prism.js', (req, res) => {
  res.send(fs.readFileSync(path.resolve('chromeExtension', 'prism.js')).toString())
})

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
  stats: 'errors-only'
}))

app.use(webpackHotMiddleware(compiler))

app.listen(9000)
