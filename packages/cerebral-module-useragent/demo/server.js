import express from 'express'
import path from 'path'
import webpack from 'webpack'
import webpackMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import config from './webpack.config.js'

const port = process.env.PORT ? process.env.PORT : 8080
const app = express()

app.use(express.static(__dirname + '/'))

const compiler = webpack(config)
const middleware = webpackMiddleware(compiler, {
  publicPath: config.output.publicPath,

  stats: {
    colors: true,
    hash: false,
    timings: true,
    chunks: false,
    chunkModules: false,
    modules: false
  }
})

app.use(middleware)
app.use(webpackHotMiddleware(compiler))

const fallback = path.join(__dirname, 'dist/index.html')
app.get('*', function (req, res) {
  res.write(middleware.fileSystem.readFileSync(fallback))
  res.end()
})

app.listen(port, '0.0.0.0', function (err) {
  if (err) {
    console.log(err)
  }
  console.info('==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port)
})
